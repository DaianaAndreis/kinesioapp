import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://adknvrdtgvycwgfqwedo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFka252cmR0Z3Z5Y3dnZnF3ZWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjgwMzIsImV4cCI6MjA4ODg0NDAzMn0.oq7OFmWPZvCjuPMJMdSVrEGPhMY_k4xy6WdwJ53pQX0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)