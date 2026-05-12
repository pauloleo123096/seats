import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { desk_id, profile_id, start_time, end_time, shift_type } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: conflicts, error: conflictError } = await supabase
    .from('schedules')
    .select('id, profiles(full_name)')
    .eq('desk_id', desk_id)
    .or(`and(start_time.lt.${end_time},end_time.gt.${start_time})`);

  if (conflictError) throw conflictError;

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({ error: 'Shift Collision Detected' }, { status: 409 });
  }

  const { data: schedule, error: insertError } = await supabase
    .from('schedules')
    .insert([{ desk_id, profile_id, start_time, end_time, shift_type }])
    .select();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });
  
  return NextResponse.json({ success: true, schedule });
}
