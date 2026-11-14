-- ==============================================================================
-- VisionRoot Service Request Management System — Database Migration
-- Version: 001
-- Name: 001_create_service_requests.sql
-- Description: Creates the core service_requests table, indexes, check constraints,
--              and automatic updated_at trigger function.
-- Specification Reference: docs/data-model.md
-- ==============================================================================

-- 1. Ensure UUID generation extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Data integrity check constraints
    CONSTRAINT check_title_length CHECK (char_length(trim(title)) >= 5 AND char_length(trim(title)) <= 100),
    CONSTRAINT check_description_length CHECK (char_length(trim(description)) >= 10 AND char_length(trim(description)) <= 1000),
    CONSTRAINT check_category_enum CHECK (category IN ('IT', 'Facilities', 'Other')),
    CONSTRAINT check_priority_enum CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT check_status_enum CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

-- 3. Create high-performance B-tree indexes for dashboard and filter queries
CREATE INDEX IF NOT EXISTS idx_service_requests_status
    ON service_requests(status);

CREATE INDEX IF NOT EXISTS idx_service_requests_created_at
    ON service_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_requests_status_created
    ON service_requests(status, created_at DESC);

-- 4. Create trigger function to manage updated_at automatically
CREATE OR REPLACE FUNCTION update_service_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach trigger to service_requests table
DROP TRIGGER IF EXISTS trigger_service_requests_updated_at ON service_requests;
CREATE TRIGGER trigger_service_requests_updated_at
    BEFORE UPDATE ON service_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_service_requests_updated_at();

-- Schema Comments for self-documenting database inspection
COMMENT ON TABLE service_requests IS 'Core entity storing employee IT and Facilities service requests';
COMMENT ON COLUMN service_requests.id IS 'Immutable UUID v4 primary key generated at database level';
COMMENT ON COLUMN service_requests.status IS 'Current lifecycle state (OPEN, IN_PROGRESS, RESOLVED, CLOSED)';
