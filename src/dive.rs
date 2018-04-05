use chrono::{DateTime, Utc};

#[derive(Debug, Serialize)]
pub struct Log {
    pub dives: Vec<Dive>,
}

#[derive(Debug, Serialize)]
pub struct Dive {
    pub number: i32,
    pub date: DateTime<Utc>,
    pub entry_time: DateTime<Utc>,
    pub surface: String,
    pub dive_time: String,
    pub country: String,
    pub city: String,
    pub point: String,
    pub lat: f32,
    pub lng: f32,
    pub depth: f32,
    pub buddy: String,
    pub signature: String,
    pub comments: String,
    pub water: String,
    pub entry: String,
    pub dive_type: String,
    pub tank_type: String,
    pub tank_size: f32,
}
