import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { desks } = await req.json(); 

  const updates = desks.map(desk => 
    supabase.from('desks')
      .update({ x_coordinate: desk.x_coordinate, y_coordinate: desk.y_coordinate })
      .eq('id', desk.id)
  );

  await Promise.all(updates);
  return NextResponse.json({ success: true });
}
