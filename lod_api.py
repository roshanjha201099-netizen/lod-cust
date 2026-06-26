from datetime import datetime
from uuid import uuid4

from flask import Flask, jsonify, request


app = Flask(__name__)

users = []
requirements = []
service_providers = []
queries = []


def now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


service_providers.extend(
    [
        {
            "id": str(uuid4()),
            "name": "Ramesh Electric Works",
            "location": "560038",
            "phone": "9876500011",
            "service": "Electrician",
            "rating": 4.7,
            "picUrl": "https://example.com/providers/electrician-1.jpg",
            "createdAt": now_iso(),
        },
        {
            "id": str(uuid4()),
            "name": "Suresh Plumbing Service",
            "location": "560039",
            "phone": "9876500012",
            "service": "Plumber",
            "rating": 4.5,
            "picUrl": "https://example.com/providers/plumber-1.jpg",
            "createdAt": now_iso(),
        },
        {
            "id": str(uuid4()),
            "name": "Anil Carpenter Point",
            "location": "560040",
            "phone": "9876500013",
            "service": "Carpenter",
            "rating": 4.6,
            "picUrl": "https://example.com/providers/carpenter-1.jpg",
            "createdAt": now_iso(),
        },
        {
            "id": str(uuid4()),
            "name": "Quick Fix Electrician",
            "location": "560037",
            "phone": "9876500014",
            "service": "Electrician",
            "rating": 4.4,
            "picUrl": "https://example.com/providers/electrician-2.jpg",
            "createdAt": now_iso(),
        },
        {
            "id": str(uuid4()),
            "name": "Cool Air AC Service",
            "location": "560038",
            "phone": "9876500015",
            "service": "AC Technician",
            "rating": 4.8,
            "picUrl": "https://example.com/providers/ac-1.jpg",
            "createdAt": now_iso(),
        },
        {
            "id": str(uuid4()),
            "name": "Helper Home Support",
            "location": "560036",
            "phone": "9876500016",
            "service": "Helper",
            "rating": 4.3,
            "picUrl": "https://example.com/providers/helper-1.jpg",
            "createdAt": now_iso(),
        },
    ]
)


def find_user_by_email(email: str):
    return next((user for user in users if user["email"].lower() == email.lower()), None)


def normalize_service_name(value: str) -> str:
    return value.strip().lower()


def is_nearby_pincode(source: str, target: str) -> bool:
    if not source or not target or not source.isdigit() or not target.isdigit():
        return False
    return abs(int(source) - int(target)) <= 2


def find_matching_providers(service: str, pincode: str):
    normalized_service = normalize_service_name(service)
    matches = []

    for provider in service_providers:
        provider_service = normalize_service_name(provider["service"])
        if normalized_service and provider_service != normalized_service:
            continue
        if not is_nearby_pincode(pincode, provider["location"]):
            continue
        matches.append(provider)

    matches.sort(
        key=lambda provider: (
            provider["location"] != pincode,
            abs(int(provider["location"]) - int(pincode)),
            -provider["rating"],
        )
    )
    return matches


@app.post("/api/signup")
def signup():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip()
    password = str(data.get("password", "")).strip()
    full_name = str(data.get("fullName", "")).strip()
    mobile = str(data.get("mobile", "")).strip()

    if not email or not password or not mobile:
        return jsonify({"error": "email, password, and mobile are required"}), 400

    if find_user_by_email(email):
        return jsonify({"error": "user already exists"}), 409

    user = {
        "id": str(uuid4()),
        "email": email,
        "password": password,
        "fullName": full_name,
        "mobile": mobile,
        "streetAddress": str(data.get("streetAddress", "")).strip(),
        "area": str(data.get("area", "")).strip(),
        "city": str(data.get("city", "")).strip(),
        "state": str(data.get("state", "")).strip(),
        "pincode": str(data.get("pincode", "")).strip(),
        "createdAt": now_iso(),
    }
    users.append(user)

    response_user = {key: value for key, value in user.items() if key != "password"}
    return jsonify({"message": "signup successful", "user": response_user}), 201


@app.post("/api/signin")
def signin():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip()
    password = str(data.get("password", "")).strip()

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = find_user_by_email(email)
    if not user or user["password"] != password:
        return jsonify({"error": "invalid email or password"}), 401

    response_user = {key: value for key, value in user.items() if key != "password"}
    return jsonify({"message": "signin successful", "user": response_user}), 200


@app.post("/api/post-requirement")
def post_requirement():
    data = request.get_json(silent=True) or {}

    service = str(data.get("service", "")).strip()
    requirement_text = str(
        data.get("requirement")
        or data.get("requirementText")
        or data.get("description")
        or ""
    ).strip()
    pincode = str(data.get("pincode", "")).strip()

    if (not service and not requirement_text) or not pincode:
        return (
            jsonify(
                {
                    "error": "service or requirement is required, and pincode is required"
                }
            ),
            400,
        )

    requirement = {
        "id": str(uuid4()),
        "service": service,
        "requirement": requirement_text,
        "pincode": pincode,
        "userEmail": str(data.get("userEmail", "")).strip(),
        "createdAt": now_iso(),
    }
    requirements.append(requirement)
    matching_providers = find_matching_providers(service, pincode)

    return (
        jsonify(
            {
                "message": "requirement posted successfully",
                "requirement": requirement,
                "providers": matching_providers,
            }
        ),
        201,
    )


@app.post("/api/join-service")
def join_service():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()

    if not name or not phone:
        return jsonify({"error": "name and phone are required"}), 400

    provider = {
        "id": str(uuid4()),
        "name": name,
        "location": str(data.get("location") or data.get("pincode") or "").strip(),
        "phone": phone,
        "service": str(data.get("service", "")).strip(),
        "rating": float(data.get("rating", 0) or 0),
        "picUrl": str(data.get("picUrl", "")).strip(),
        "createdAt": now_iso(),
    }
    if not provider["location"] or not provider["service"] or not provider["picUrl"]:
        return jsonify({"error": "location, service, and picUrl are required"}), 400

    service_providers.append(provider)

    return jsonify({"message": "service join request saved", "provider": provider}), 201


@app.post("/api/raise-query")
def raise_query():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    problem_description = str(data.get("problemDescription", "")).strip()

    if not name or not phone or not problem_description:
        return jsonify({"error": "name, phone, and problemDescription are required"}), 400

    query = {
        "id": str(uuid4()),
        "name": name,
        "phone": phone,
        "problemDescription": problem_description,
        "createdAt": now_iso(),
    }
    queries.append(query)

    return jsonify({"message": "query submitted successfully", "query": query}), 201


if __name__ == "__main__":
    app.run(debug=True)
