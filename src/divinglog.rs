use dive;
use serde_xml_rs;
use chrono::prelude::*;

#[derive(Deserialize, Debug)]
struct Divinglog {
    #[serde(rename = "DBVersion")] db_version: String,
    #[serde(rename = "Logbook")] logbook: Logbook,
}

#[derive(Deserialize, Debug)]
struct Logbook {
    #[serde(rename = "Dive")] dives: Vec<Dive>,
}

#[derive(Deserialize, Debug)]
struct Dive {
    #[serde(rename = "ID")] id: String,
    #[serde(rename = "Number")] number: String,
    #[serde(rename = "Divedate")] date: String,
    #[serde(rename = "Entrytime")] entry_time: String,
    #[serde(rename = "Surfint")] surface: String,
    #[serde(rename = "Country")] country: NamedItem,
    #[serde(rename = "City")] city: NamedItem,
    #[serde(rename = "Place")] place: Place,
    #[serde(rename = "Divetime")] dive_time: String,
    #[serde(rename = "Depth")] depth: String,
    #[serde(rename = "Buddy")] buddy: NamesItem,
    #[serde(rename = "Signature")] signature: String,
    #[serde(rename = "Comments")] comments: String,
    #[serde(rename = "Water")] water: String,
    #[serde(rename = "Entry")] entry: String,
    #[serde(rename = "Divetype")] dive_type: String,
    #[serde(rename = "Tanktype")] tank_type: String,
    #[serde(rename = "Tanksize")] tank_size: String,
}

#[derive(Deserialize, Debug)]
struct NamedItem {
    #[serde(rename = "Name")] name: String,
}

#[derive(Deserialize, Debug)]
struct NamesItem {
    #[serde(rename = "Names")] name: String,
}

#[derive(Deserialize, Debug)]
struct Place {
    #[serde(rename = "Name")] name: String,
    #[serde(rename = "Lat")] lat: String,
    #[serde(rename = "Lon")] lon: String,
}

fn map_my_dive_to_dive(dive: &Dive) -> dive::Dive {
    let date = format!("{} {}:00", dive.date, dive.entry_time);
    let date = Utc.datetime_from_str(&date, "%Y-%m-%d %H:%M:%S").unwrap();

    dive::Dive {
        city: dive.city.name.clone(),
        country: dive.country.name.clone(),
        date,
        dive_time: dive.dive_time.clone(),
        entry_time: date.clone(),
        number: dive.number.parse::<i32>().unwrap(),
        surface: dive.surface.clone(),
        point: dive.place.name.clone(),
        lat: dive.place.lat.parse::<f32>().unwrap(),
        lng: dive.place.lon.parse::<f32>().unwrap(),
        depth: dive.depth.parse::<f32>().unwrap(),
        buddy: dive.buddy.name.clone(),
        signature: dive.signature.clone(),
        comments: dive.comments.clone(),
        water: dive.water.clone(),
        entry: dive.entry.clone(),
        dive_type: dive.dive_type.clone(),
        tank_type: dive.tank_type.clone(),
        tank_size: dive.tank_size.parse::<f32>().unwrap(),
    }
}

pub fn parse(data: String) -> dive::Log {
    let imported_log: Divinglog =
        serde_xml_rs::deserialize(data.as_bytes()).unwrap_or_else(|err| {
            println!("{:?}", err);
            panic!(err)
        });

    dive::Log {
        dives: imported_log
            .logbook
            .dives
            .iter()
            .map(map_my_dive_to_dive)
            .collect(),
    }
}
