// this is just for documentation, i already ran this on supabase

-- Create RPC function for atomic increment
CREATE OR REPLACE FUNCTION increment_page_visits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count INTEGER;
BEGIN
    -- Use a more atomic approach with RETURNING
    UPDATE public.analytics 
    SET page_visits = page_visits + 1 
    WHERE id = 1 
    RETURNING page_visits INTO new_count;
    
    -- If no rows were updated, create the record
    IF new_count IS NULL THEN
        INSERT INTO public.analytics (id, page_visits) 
        VALUES (1, 1) 
        ON CONFLICT (id) 
        DO UPDATE SET page_visits = public.analytics.page_visits + 1
        RETURNING page_visits INTO new_count;
    END IF;
    
    RETURN new_count;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.analytics TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_page_visits() TO anon, authenticated; 