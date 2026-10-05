-- Supabase Database Schema for AI Growth Engine
-- 7-Day AI Builder Challenge

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- References auth.users(id) if Supabase Auth is enabled
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    college TEXT NOT NULL,
    graduation_year INTEGER NOT NULL,
    skill_level TEXT NOT NULL,
    goal TEXT NOT NULL,
    segment TEXT NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb,
    experiment_variant TEXT DEFAULT 'A',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table (First-Party Analytics & Event Tracking)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    event_name TEXT NOT NULL,
    variant TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast analytics aggregation
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- 3. Experiments Table
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active', -- active, paused, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Experiment Assignments Table
CREATE TABLE IF NOT EXISTS experiment_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT,
    variant TEXT NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(experiment_id, user_id),
    UNIQUE(experiment_id, session_id)
);

-- 5. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    segment TEXT NOT NULL,
    project TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_days INTEGER DEFAULT 7,
    reason TEXT NOT NULL,
    learning_path JSONB NOT NULL, -- Array of step strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    day_number INTEGER UNIQUE NOT NULL,
    estimated_minutes INTEGER NOT NULL,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Challenge Progress Table
CREATE TABLE IF NOT EXISTS challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, day_number)
);

-- Default Challenges Seed Data
INSERT INTO challenges (day_number, title, description, estimated_minutes, resources) VALUES
(1, 'Project Setup & Architecture', 'Set up your GitHub repo, environment variables, and initialize your AI development workspace.', 45, '["https://docs.openai.com", "https://nextjs.org/docs"]'),
(2, 'Build the Input Interface', 'Design a slick user interface to accept input data from users with instant client-side validation.', 60, '["https://tailwindcss.com", "https://framer.com/motion"]'),
(3, 'Connect the AI API', 'Set up server-side API routes, connect to OpenAI API, and implement prompt engineering logic.', 60, '["https://platform.openai.com/docs/api-reference"]'),
(4, 'Implement Core AI Processing', 'Process raw model responses, format JSON outputs, and handle streaming/error states seamlessly.', 75, '["https://sdk.vercel.ai/docs"]'),
(5, 'Polish UI & User Experience', 'Add smooth transitions, loading skeletons, responsive layouts, and modern glassmorphism aesthetic.', 60, '["https://lucide.dev"]'),
(6, 'Testing & Edge-Case Handling', 'Test rate limits, invalid user inputs, timeout fallbacks, and write unit tests for core logic.', 45, '["https://nextjs.org/docs/app/building-your-application/testing"]'),
(7, 'Portfolio Presentation & Deploy', 'Deploy your live project to Vercel, record a 60-second video demo, and share it on LinkedIn/Twitter.', 60, '["https://vercel.com/docs"]')
ON CONFLICT (day_number) DO NOTHING;

-- Row Level Security (RLS) setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo / public flow (adjust for enterprise auth as needed)
CREATE POLICY "Public profiles access" ON profiles FOR ALL USING (true);
CREATE POLICY "Public events access" ON events FOR ALL USING (true);
CREATE POLICY "Public experiment assignments" ON experiment_assignments FOR ALL USING (true);
CREATE POLICY "Public recommendations access" ON recommendations FOR ALL USING (true);
CREATE POLICY "Public challenge progress access" ON challenge_progress FOR ALL USING (true);
