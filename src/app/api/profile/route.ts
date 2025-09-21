import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const continentSchema = z.object({
  continent: z.enum(["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"])
});

const validContinents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { 
        status: 401 
      });
    }
    
    const sessionUser = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      continent: user.continent
    })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    
    if (sessionUser.length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { 
        status: 404 
      });
    }
    
    return NextResponse.json(sessionUser[0], { status: 200 });
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json({ 
      error: "Internal server error: " + error 
    }, { 
      status: 500 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { 
        status: 401 
      });
    }
    
    const body = await request.json();
    const validationResult = continentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: "Invalid continent", 
        validContinents 
      }, { 
        status: 400 
      });
    }
    
    const updatedUser = await db.update(user)
      .set({
        continent: validationResult.data.continent,
        updatedAt: new Date()
      })
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        continent: user.continent
      });
    
    if (updatedUser.length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { 
        status: 404 
      });
    }
    
    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error) {
    console.error('POST profile error:', error);
    return NextResponse.json({ 
      error: "Internal server error: " + error 
    }, { 
      status: 500 
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ 
        error: "Unauthorized" 
      }, { 
        status: 401 
      });
    }
    
    const body = await request.json();
    const validationResult = continentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: "Invalid continent", 
        validContinents 
      }, { 
        status: 400 
      });
    }
    
    const updatedUser = await db.update(user)
      .set({
        continent: validationResult.data.continent,
        updatedAt: new Date()
      })
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        continent: user.continent
      });
    
    if (updatedUser.length === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { 
        status: 404 
      });
    }
    
    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error) {
    console.error('PATCH profile error:', error);
    return NextResponse.json({ 
      error: "Internal server error: " + error 
    }, { 
      status: 500 
    });
  }
}