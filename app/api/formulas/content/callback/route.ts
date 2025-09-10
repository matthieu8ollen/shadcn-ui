import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use Redis/Database in production)
const responses = new Map<string, any>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  
  console.log('📞 Callback GET request for session:', sessionId)
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }
  
  const response = responses.get(sessionId)
  
  if (response) {
    // Check if we have both content and guidance
    const hasContent = !!response.generatedContent
    const hasGuidance = !!response.guidance
    
    console.log('✅ Found response for session:', sessionId, { hasContent, hasGuidance })
    
    if (hasContent && hasGuidance) {
      // We have both pieces - return final response
      console.log('🎉 Complete response ready!')
      responses.delete(sessionId) // Clear after returning
      return NextResponse.json({
        success: true,
        data: response,
        type: 'final'
      })
    } else {
      // Still waiting for one of the pieces
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
        all_filled_variables: transformVariables(data.all_filled_variables),
        generated_content: data.generated_content
      }
    } else if (data.response_type === 'writing_guidance_extracted') {
      console.log('📝 Processing writing guidance response')
      existingResponse.guidance = {
        writing_guidance_sections: data.writing_guidance_sections
      }
    }
    
    // Store the updated response
    responses.set(sessionId, existingResponse)
    
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

function transformVariables(allFilledVariables: any): Record<string, string> {
  const simplified: Record<string, string> = {}
  
  if (allFilledVariables) {
    for (const [key, value] of Object.entries(allFilledVariables)) {
      if (typeof value === 'object' && value && 'value' in value) {
        // Convert to lowercase to match frontend expectations
        simplified[key.toLowerCase()] = (value as any).value
      }
    }
  }
  
  console.log('🔀 Transformed variables:', Object.keys(simplified))
  return simplified
}
