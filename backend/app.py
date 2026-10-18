import os
import random
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import psycopg
from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv(Path(__file__).with_name(".env"))

app = Flask(__name__)


def get_connection():
    return psycopg.connect(
        host=os.environ["DB_HOST"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        connect_timeout=5,
    )


@app.get("/api/health")
def health():
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT current_database();")
                database_name = cursor.fetchone()[0]
        return jsonify(status="ok", database=database_name)
    except (psycopg.Error, KeyError):
        return jsonify(
            status="error",
            message="Database connection failed."
        ), 503


@app.post("/api/reservations")
def reserve():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(message="Please submit a valid reservation."), 400

    name = data.get("customer_name")
    email = data.get("email")
    phone = data.get("phone_number", "")

    if not all(isinstance(value, str) for value in [name, email, phone]):
        return jsonify(message="Please check your contact details."), 400

    name = name.strip()
    email = email.strip().lower()
    phone = phone.strip()

    if not name or len(name) > 100:
        return jsonify(message="Please enter your name (maximum 100 characters)."), 400

    if len(email) > 254 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify(message="Please enter a valid email address."), 400

    if len(phone) > 30:
        return jsonify(message="Phone number is too long."), 400

    guests = data.get("number_of_guests")
    if type(guests) is not int or not 1 <= guests <= 2147483647:
        return jsonify(message="Please enter a valid positive guest count."), 400

    try:
        slot = datetime.fromisoformat(data.get("time_slot", ""))
        if slot.tzinfo is not None:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify(message="Please choose a valid date and time."), 400

    now = datetime.now(ZoneInfo("America/New_York")).replace(tzinfo=None)
    closing_hour = 21 if slot.weekday() == 6 else 23

    if (
        slot <= now
        or slot.minute != 0
        or slot.second != 0
        or slot.microsecond != 0
        or not 17 <= slot.hour < closing_hour
    ):
        return jsonify(
            message="Choose a future hourly slot during our opening hours."
        ), 400

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                # Process one booking at a time to prevent double bookings.
                cursor.execute(
                    "LOCK TABLE reservations IN EXCLUSIVE MODE;"
                )

                cursor.execute(
                    "SELECT table_number FROM reservations WHERE time_slot = %s;",
                    (slot,),
                )
                booked = {row[0] for row in cursor.fetchall()}
                available = [
                    number for number in range(1, 31) if number not in booked
                ]

                if not available:
                    return jsonify(
                        message="This time is fully booked. Please choose another time."
                    ), 409

                table = random.choice(available)

                cursor.execute(
                    """
                    INSERT INTO customers
                        (customer_name, email, phone_number)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (email) DO UPDATE SET
                        customer_name = EXCLUDED.customer_name,
                        phone_number = EXCLUDED.phone_number
                    RETURNING customer_id;
                    """,
                    (name, email, phone or None),
                )
                customer_id = cursor.fetchone()[0]

                cursor.execute(
                    """
                    INSERT INTO reservations
                        (customer_id, time_slot, number_of_guests, table_number)
                    VALUES (%s, %s, %s, %s)
                    RETURNING reservation_id;
                    """,
                    (customer_id, slot, guests, table),
                )
                reservation_id = cursor.fetchone()[0]

        return jsonify(
            message=(
                f"Reservation confirmed! Booking #{reservation_id}, "
                f"table {table}, on {slot:%Y-%m-%d at %I:%M %p} "
                f"(Washington, DC time) for {guests} guests."
            )
        ), 201

    except (psycopg.Error, KeyError):
        return jsonify(
            message="We could not save your booking. Please try again shortly."
        ), 503
@app.post("/api/newsletter")
def newsletter():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(message="Please submit a valid email address."), 400

    email = data.get("email")

    if not isinstance(email, str):
        return jsonify(message="Please enter a valid email address."), 400

    email = email.strip().lower()

    if len(email) > 254 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify(message="Please enter a valid email address."), 400

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO customers (email, newsletter_signup)
                    VALUES (%s, TRUE)
                    ON CONFLICT (email) DO UPDATE SET
                        newsletter_signup = TRUE;
                    """,
                    (email,),
                )

        return jsonify(
            message="Thank you! You are subscribed to our newsletter."
        ), 200

    except (psycopg.Error, KeyError):
        return jsonify(
            message="We could not save your signup. Please try again shortly."
        ), 503

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)