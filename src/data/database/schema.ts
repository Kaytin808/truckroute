export const SCHEMA_VERSION = 1;

export const schemaStatements: string[] = [
  `CREATE TABLE IF NOT EXISTS app_meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS truck_profiles (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    height_inches INTEGER NOT NULL CHECK(height_inches > 0),
    gross_weight_lb INTEGER NOT NULL CHECK(gross_weight_lb > 0),
    tractor_length_inches INTEGER NOT NULL CHECK(tractor_length_inches >= 0),
    trailer_length_inches INTEGER NOT NULL CHECK(trailer_length_inches >= 0),
    width_inches INTEGER NOT NULL CHECK(width_inches > 0),
    axle_count INTEGER NOT NULL CHECK(axle_count > 0),
    trailer_count INTEGER NOT NULL CHECK(trailer_count >= 0),
    hazmat_class TEXT NOT NULL DEFAULT 'none',
    safety_buffer_inches INTEGER NOT NULL DEFAULT 6,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS one_active_truck_profile
    ON truck_profiles(is_active) WHERE is_active = 1`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS route_cache (
    cache_key TEXT PRIMARY KEY NOT NULL,
    provider TEXT NOT NULL,
    request_json TEXT NOT NULL,
    response_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    last_used_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS route_cache_expiry ON route_cache(expires_at)`,
  `CREATE TABLE IF NOT EXISTS geocode_cache (
    cache_key TEXT PRIMARY KEY NOT NULL,
    query TEXT NOT NULL,
    result_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS poi_cache (
    id TEXT PRIMARY KEY NOT NULL,
    osm_type TEXT,
    osm_id TEXT,
    category TEXT NOT NULL,
    name TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    attributes_json TEXT NOT NULL,
    source TEXT NOT NULL,
    fetched_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS poi_cache_location ON poi_cache(latitude, longitude)`,
  `CREATE TABLE IF NOT EXISTS bridge_restrictions (
    row_id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    clearance_inches INTEGER,
    posted_weight_lb INTEGER,
    max_length_inches INTEGER,
    road_name TEXT,
    source TEXT NOT NULL,
    source_updated_at TEXT,
    imported_at TEXT NOT NULL,
    UNIQUE(external_id, source)
  )`,
  `CREATE VIRTUAL TABLE IF NOT EXISTS bridge_restrictions_rtree USING rtree(
    row_id, min_latitude, max_latitude, min_longitude, max_longitude
  )`,
  `CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    truck_profile_id TEXT,
    status TEXT NOT NULL DEFAULT 'planned',
    route_json TEXT,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(truck_profile_id) REFERENCES truck_profiles(id)
  )`,
  `CREATE TABLE IF NOT EXISTS trip_stops (
    id TEXT PRIMARY KEY NOT NULL,
    trip_id TEXT NOT NULL,
    sequence INTEGER NOT NULL,
    kind TEXT NOT NULL,
    label TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    notes TEXT,
    planned_arrival TEXT,
    arrived_at TEXT,
    departed_at TEXT,
    UNIQUE(trip_id, sequence),
    FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY NOT NULL,
    poi_id TEXT,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    notes TEXT,
    rating INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS personal_status_reports (
    id TEXT PRIMARY KEY NOT NULL,
    poi_id TEXT NOT NULL,
    report_type TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    reported_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS reports_by_poi ON personal_status_reports(poi_id, reported_at)`,
  `CREATE TABLE IF NOT EXISTS hos_reminders (
    id TEXT PRIMARY KEY NOT NULL,
    cycle_started_at TEXT NOT NULL,
    shift_started_at TEXT,
    drive_started_at TEXT,
    drive_seconds INTEGER NOT NULL DEFAULT 0,
    shift_seconds INTEGER NOT NULL DEFAULT 0,
    cycle_seconds INTEGER NOT NULL DEFAULT 0,
    state TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS load_log (
    id TEXT PRIMARY KEY NOT NULL,
    reference TEXT,
    customer TEXT,
    pickup_at TEXT,
    delivered_at TEXT,
    pay_cents INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS fuel_log (
    id TEXT PRIMARY KEY NOT NULL,
    fueled_at TEXT NOT NULL,
    odometer_miles REAL,
    gallons REAL NOT NULL,
    total_cost_cents INTEGER,
    latitude REAL,
    longitude REAL,
    notes TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS weather_cache (
    cache_key TEXT PRIMARY KEY NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    response_json TEXT NOT NULL,
    fetched_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS offline_regions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    style_url TEXT NOT NULL,
    bounds_json TEXT NOT NULL,
    min_zoom REAL NOT NULL,
    max_zoom REAL NOT NULL,
    status TEXT NOT NULL,
    downloaded_bytes INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  )`,
];
