CREATE OR REPLACE FUNCTION calculate_total (
        range_arg VARCHAR DEFAULT 'last30days',
        type_arg VARCHAR DEFAULT NULL
    ) RETURNS TABLE (current_amount NUMERIC, previous_amount NUMERIC) AS $$
DECLARE currentStart TIMESTAMP;
currentEnd TIMESTAMP;
previousStart TIMESTAMP;
previousEnd TIMESTAMP;
BEGIN currentEnd := now();
currentStart := CASE
    WHEN range_arg = 'last24hours' THEN currentEnd - interval '24 hours'
    WHEN range_arg = 'last7days' THEN currentEnd - interval '7 days'
    WHEN range_arg = 'last30days' THEN currentEnd - interval '30 days'
    WHEN range_arg = 'last12months' THEN currentEnd - interval '12 months'
    ELSE currentEnd - interval '30 days'
END;
previousEnd := currentStart - interval '1 second';
previousStart := currentStart - (currentEnd - currentStart);
RETURN QUERY
SELECT COALESCE(
        SUM(
            CASE
                WHEN created_at BETWEEN currentStart AND currentEnd THEN amount
                ELSE 0
            END
        ),
        0
    ) AS current_amount,
    COALESCE(
        SUM(
            CASE
                WHEN created_at BETWEEN previousStart AND previousEnd THEN amount
                ELSE 0
            END
        ),
        0
    ) AS previous_amount
FROM transactions
WHERE (
        type = type_arg
        OR type_arg IS NULL
    );
END;
$$ LANGUAGE plpgsql;