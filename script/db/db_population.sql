-- Database population script using automatic UUID generation via CTEs and RETURNING clauses

WITH inserted_services AS (
    -- Insert services and return generated UUIDs with names
    INSERT INTO service (name, avg_time) VALUES
    ('Shipping', 300),          -- 5 minutes
    ('Account Management', 600), -- 10 minutes
    ('Deposits', 240)            -- 4 minutes
    RETURNING id_service, name
),
inserted_counters AS (
    -- Insert counters and return generated UUIDs with numbers
    INSERT INTO counter (number) VALUES
    (1),
    (2),
    (3)
    RETURNING id_counter, number
),
inserted_counter_services AS (
    -- Link counters and services in the junction table based on counter numbers and service names
    -- Counter 1 handles Shipping exclusively
    -- Counter 2 handles both Account Management and Deposits
    -- Counter 3 handles Deposits exclusively
    INSERT INTO counter_service (id_counter, id_service)
    SELECT c.id_counter, s.id_service
    FROM inserted_counters c, inserted_services s
    WHERE (c.number = 1 AND s.name = 'Shipping')
       OR (c.number = 2 AND s.name IN ('Account Management', 'Deposits'))
       OR (c.number = 3 AND s.name = 'Deposits')
    RETURNING id_counter, id_service
)
-- Insert tickets linking them to the newly generated UUIDs
INSERT INTO ticket (number, state, issue_date, issue_timestamp, serve_timestamp, id_service, id_counter)
SELECT 
    t.number, 
    t.state, 
    t.issue_date, 
    t.issue_timestamp, 
    t.serve_timestamp, 
    s.id_service, 
    c.id_counter
FROM (
    VALUES 
        -- Ticket already served at Counter 1 for Shipping service
        ('S-001', 'SERVED'::ticket_state, CURRENT_DATE, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 55 minutes', 'Shipping', 1),
        
        -- Ticket currently called at Counter 2 for Account Management
        ('A-001', 'CALLED'::ticket_state, CURRENT_DATE, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '1 minute', 'Account Management', 2),
        
        -- Pending tickets for Deposits (not yet assigned to a counter or served)
        ('D-001', 'PENDING'::ticket_state, CURRENT_DATE, NOW() - INTERVAL '10 minutes', NULL, 'Deposits', NULL),
        ('D-002', 'PENDING'::ticket_state, CURRENT_DATE, NOW() - INTERVAL '5 minutes', NULL, 'Deposits', NULL)
) AS t(number, state, issue_date, issue_timestamp, serve_timestamp, service_name, counter_number)
JOIN inserted_services s ON s.name = t.service_name
LEFT JOIN inserted_counters c ON c.number = t.counter_number;