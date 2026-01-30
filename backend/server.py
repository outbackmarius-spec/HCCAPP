from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ========== MODELS ==========

# Check-in Models
class CheckIn(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: Optional[str] = None
    is_first_time: bool = False
    notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CheckInCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    is_first_time: bool = False
    notes: Optional[str] = None

# Prayer Request Models
class PrayerRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    request: str
    is_anonymous: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PrayerRequestCreate(BaseModel):
    name: Optional[str] = None
    request: str
    is_anonymous: bool = False

# Volunteer Models
class Volunteer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    ministry_areas: List[str]
    availability: str
    notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class VolunteerCreate(BaseModel):
    name: str
    email: str
    phone: str
    ministry_areas: List[str]
    availability: str
    notes: Optional[str] = None

# Donation Intent Models
class Donation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    amount: float
    donation_type: str  # "one-time" or "recurring"
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DonationCreate(BaseModel):
    name: str
    email: str
    amount: float
    donation_type: str = "one-time"
    message: Optional[str] = None

# Life Group Models
class LifeGroup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    leader: str
    schedule: str
    location: str
    max_members: int = 12
    current_members: int = 0
    image_url: Optional[str] = None

class LifeGroupSignup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    group_id: str
    name: str
    email: str
    phone: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class LifeGroupSignupCreate(BaseModel):
    group_id: str
    name: str
    email: str
    phone: str

# Sermon Models
class Sermon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    speaker: str
    youtube_url: str
    thumbnail_url: str
    date: datetime
    series: Optional[str] = None

# Question Models
class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    email: Optional[str] = None
    question: str
    is_anonymous: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class QuestionCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    question: str
    is_anonymous: bool = False

# Connect Request Models
class ConnectRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    interest: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ConnectRequestCreate(BaseModel):
    name: str
    email: str
    phone: str
    interest: str = "Life Group"


# ========== API ROUTES ==========

@api_router.get("/")
async def root():
    return {"message": "Highfields Community Church API - #RISE26"}

# Check-in Routes
@api_router.post("/checkins", response_model=CheckIn)
async def create_checkin(input: CheckInCreate):
    checkin_obj = CheckIn(**input.dict())
    await db.checkins.insert_one(checkin_obj.dict())
    return checkin_obj

@api_router.get("/checkins", response_model=List[CheckIn])
async def get_checkins():
    checkins = await db.checkins.find().sort("timestamp", -1).to_list(100)
    return [CheckIn(**c) for c in checkins]

@api_router.get("/checkins/today", response_model=List[CheckIn])
async def get_today_checkins():
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    checkins = await db.checkins.find({"timestamp": {"$gte": today_start}}).to_list(1000)
    return [CheckIn(**c) for c in checkins]

# Prayer Request Routes
@api_router.post("/prayer-requests", response_model=PrayerRequest)
async def create_prayer_request(input: PrayerRequestCreate):
    request_obj = PrayerRequest(**input.dict())
    await db.prayer_requests.insert_one(request_obj.dict())
    return request_obj

@api_router.get("/prayer-requests", response_model=List[PrayerRequest])
async def get_prayer_requests():
    requests = await db.prayer_requests.find().sort("timestamp", -1).to_list(100)
    return [PrayerRequest(**r) for r in requests]

# Question Routes
@api_router.post("/questions", response_model=Question)
async def create_question(input: QuestionCreate):
    question_obj = Question(**input.dict())
    await db.questions.insert_one(question_obj.dict())
    return question_obj

# Volunteer Routes
@api_router.post("/volunteers", response_model=Volunteer)
async def create_volunteer(input: VolunteerCreate):
    volunteer_obj = Volunteer(**input.dict())
    await db.volunteers.insert_one(volunteer_obj.dict())
    return volunteer_obj

@api_router.get("/volunteers", response_model=List[Volunteer])
async def get_volunteers():
    volunteers = await db.volunteers.find().sort("timestamp", -1).to_list(100)
    return [Volunteer(**v) for v in volunteers]

# Donation Routes
@api_router.post("/donations", response_model=Donation)
async def create_donation(input: DonationCreate):
    donation_obj = Donation(**input.dict())
    await db.donations.insert_one(donation_obj.dict())
    return donation_obj

@api_router.get("/donations", response_model=List[Donation])
async def get_donations():
    donations = await db.donations.find().sort("timestamp", -1).to_list(100)
    return [Donation(**d) for d in donations]

# Life Group Routes
@api_router.get("/life-groups", response_model=List[LifeGroup])
async def get_life_groups():
    groups = await db.life_groups.find().to_list(100)
    if not groups:
        # Seed with default groups
        default_groups = [
            LifeGroup(
                name="Faith Foundations",
                description="A study on the core beliefs of Christianity. Perfect for new believers or those wanting to strengthen their foundation.",
                leader="Pastor John",
                schedule="Tuesdays, 7:00 PM",
                location="Church Hall A",
                max_members=12,
                current_members=8
            ),
            LifeGroup(
                name="Marriage & Family",
                description="Building stronger marriages and families through biblical principles and community support.",
                leader="David & Sarah",
                schedule="Wednesdays, 6:30 PM",
                location="Fellowship Room",
                max_members=10,
                current_members=6
            ),
            LifeGroup(
                name="Young Adults Connect",
                description="For ages 18-30. Navigating life, faith, and purpose together.",
                leader="Mike Thompson",
                schedule="Fridays, 7:30 PM",
                location="Youth Center",
                max_members=15,
                current_members=11
            ),
            LifeGroup(
                name="Women's Bible Study",
                description="Deep dive into Scripture with fellowship and prayer. Currently studying the book of Ruth.",
                leader="Jennifer Adams",
                schedule="Thursdays, 10:00 AM",
                location="Room 201",
                max_members=12,
                current_members=9
            ),
            LifeGroup(
                name="Men's Breakfast",
                description="Weekly gathering for men to grow in faith, accountability, and brotherhood.",
                leader="Robert Chen",
                schedule="Saturdays, 8:00 AM",
                location="Cafe Area",
                max_members=20,
                current_members=14
            )
        ]
        for group in default_groups:
            await db.life_groups.insert_one(group.dict())
        return default_groups
    return [LifeGroup(**g) for g in groups]

@api_router.post("/life-groups/signup", response_model=LifeGroupSignup)
async def signup_life_group(input: LifeGroupSignupCreate):
    # Check if group exists
    group = await db.life_groups.find_one({"id": input.group_id})
    if not group:
        raise HTTPException(status_code=404, detail="Life group not found")
    
    signup_obj = LifeGroupSignup(**input.dict())
    await db.life_group_signups.insert_one(signup_obj.dict())
    
    # Update member count
    await db.life_groups.update_one(
        {"id": input.group_id},
        {"$inc": {"current_members": 1}}
    )
    
    return signup_obj

# Connect Request Routes
@api_router.post("/life-groups/connect", response_model=ConnectRequest)
async def create_connect_request(input: ConnectRequestCreate):
    connect_obj = ConnectRequest(**input.dict())
    await db.connect_requests.insert_one(connect_obj.dict())
    return connect_obj

@api_router.get("/life-groups/connect", response_model=List[ConnectRequest])
async def get_connect_requests():
    requests = await db.connect_requests.find().sort("timestamp", -1).to_list(100)
    return [ConnectRequest(**r) for r in requests]

# Sermon Routes
@api_router.get("/sermons", response_model=List[Sermon])
async def get_sermons():
    sermons = await db.sermons.find().sort("date", -1).to_list(100)
    if not sermons:
        # Seed with sample sermons
        sample_sermons = [
            Sermon(
                title="RISE: A New Beginning",
                description="Pastor John kicks off our RISE series with a powerful message about new beginnings and God's purpose for your life.",
                speaker="Pastor John",
                youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                date=datetime(2025, 7, 6),
                series="RISE"
            ),
            Sermon(
                title="Faith Over Fear",
                description="Learning to trust God in uncertain times. A message of hope and courage.",
                speaker="Pastor Sarah",
                youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                date=datetime(2025, 6, 29),
                series="RISE"
            ),
            Sermon(
                title="The Power of Community",
                description="Why we need each other and how God designed us for fellowship.",
                speaker="Pastor John",
                youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                date=datetime(2025, 6, 22),
                series="Connected"
            ),
            Sermon(
                title="Grace Upon Grace",
                description="Understanding the depth of God's grace and how it transforms our lives.",
                speaker="Guest Speaker: Rev. Michael",
                youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                date=datetime(2025, 6, 15),
                series="Amazing Grace"
            )
        ]
        for sermon in sample_sermons:
            await db.sermons.insert_one(sermon.dict())
        return sample_sermons
    return [Sermon(**s) for s in sermons]

@api_router.get("/sermons/{sermon_id}", response_model=Sermon)
async def get_sermon(sermon_id: str):
    sermon = await db.sermons.find_one({"id": sermon_id})
    if not sermon:
        raise HTTPException(status_code=404, detail="Sermon not found")
    return Sermon(**sermon)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
