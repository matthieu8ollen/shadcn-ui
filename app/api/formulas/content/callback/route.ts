import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use Redis/Database in production)
const responses = new Map<string, any>()
const responseTimestamps = new Map<string, number>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  
  console.log('📞 Callback GET request for session:', sessionId)
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }
  
  // Clean up expired responses (older than 10 minutes)
  cleanupExpiredResponses()
  
  const response = responses.get(sessionId)
  
  if (response) {
    // Check if we have both content and guidance
    const hasContent = !!response.generatedContent
    const hasGuidance = !!response.guidance
    
    console.log('✅ Found response for session:', sessionId, { hasContent, hasGuidance })
    
    if (hasContent && hasGuidance) {
      console.log('🎉 Complete response ready!')
      
      // Mark as accessed but don't delete immediately
      responseTimestamps.set(sessionId, Date.now())
      
      return NextResponse.json({
        success: true,
        data: response,
        type: 'final'
      })
    } else {
      console.log('⏳ Partial response, waiting for more data')
      return NextResponse.json({
        success: false,
        message: 'Partial response received, waiting for completion'
      })
    }
  }
  
  console.log('⏳ No response yet for session:', sessionId)
  return NextResponse.json({
    success: false,
    message: 'No response yet'
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('📨 Callback POST received:', {
      response_type: data.response_type,
      session_id: data.session_id
    })
    
    const sessionId = data.session_id
    
    if (!sessionId) {
      console.error('❌ Missing session_id in callback data')
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }
    
    // Get existing response or create new one
    let existingResponse = responses.get(sessionId) || {}
    
    // Handle different response types
    if (data.response_type === 'content_generation_complete') {
  console.log('📄 Processing content generation response')
  existingResponse.generatedContent = {
  all_filled_variables: data.all_filled_variables || {}, // Store full structure, no transformation
  generated_content: data.generated_content,
  sections_data: data.sections_data || []
}
} else if (data.response_type === 'writing_guidance_extracted') {
      console.log('📝 Processing writing guidance response')
      existingResponse.guidance = {
        writing_guidance_sections: data.writing_guidance_sections
      }
    }
    
    // Store the updated response with timestamp
    responses.set(sessionId, existingResponse)
    responseTimestamps.set(sessionId, Date.now())
    
    console.log('💾 Updated response for session:', sessionId, {
      hasContent: !!existingResponse.generatedContent,
      hasGuidance: !!existingResponse.guidance,
      variableCount: existingResponse.generatedContent?.all_filled_variables ? 
        Object.keys(existingResponse.generatedContent.all_filled_variables).length : 0,
      guidanceSections: existingResponse.guidance?.writing_guidance_sections?.length || 0
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Callback POST error:', error)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}


function cleanupExpiredResponses() {
  const now = Date.now()
  const expirationTime = 10 * 60 * 1000 // 10 minutes
  
  for (const [sessionId, timestamp] of responseTimestamps.entries()) {
    if (now - timestamp > expirationTime) {
      responses.delete(sessionId)
      responseTimestamps.delete(sessionId)
      console.log('🗑️ Expired response for session:', sessionId)
    }
  }
}
