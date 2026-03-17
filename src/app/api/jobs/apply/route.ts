import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

import { getTopicLabel } from '@/lib/constants/jobs'

async function verifyHCaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.error('HCAPTCHA_SECRET_KEY is not set in environment variables')
    return { success: false, error: 'Captcha verification is not configured on the server' }
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    if (data.success === true) {
      return { success: true }
    } else {
      console.error('hCaptcha verification failed:', data['error-codes'])
      return { success: false, error: 'Captcha verification failed' }
    }
  } catch (error) {
    console.error('Error verifying hCaptcha:', error)
    return { success: false, error: 'Error connecting to captcha service' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const fullName = (formData.get('fullName') as string | null)?.trim() ?? ''
    const applicantEmail = (formData.get('applicantEmail') as string | null)?.trim() ?? ''
    const portfolioUrl = (formData.get('portfolioUrl') as string | null)?.trim() ?? ''
    const topic = formData.get('topic') as string
    const cvFile = formData.get('cv') as File
    const motivationLetterFile = formData.get('motivationLetter') as File
    const hcaptchaToken = formData.get('hcaptchaToken') as string | null

    // Verify hCaptcha token before processing form
    if (!hcaptchaToken) {
      return NextResponse.json({ error: 'Captcha verification is required' }, { status: 400 })
    }

    const captchaResult = await verifyHCaptcha(hcaptchaToken)
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: captchaResult.error || 'Captcha verification failed. Please try again.' },
        { status: 400 },
      )
    }

    // Validation
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(applicantEmail)) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 })
    }

    if (!portfolioUrl) {
      return NextResponse.json({ error: 'Portfolio/Website URL is required' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(portfolioUrl)
    } catch {
      return NextResponse.json(
        { error: 'Please provide a valid portfolio/website URL' },
        { status: 400 },
      )
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    if (!cvFile) {
      return NextResponse.json({ error: 'CV file is required' }, { status: 400 })
    }

    if (!motivationLetterFile) {
      return NextResponse.json({ error: 'Motivation letter file is required' }, { status: 400 })
    }

    // Get topic label
    const topicLabel = getTopicLabel(topic)

    // Convert files to buffers
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer())
    const motivationLetterBuffer = Buffer.from(await motivationLetterFile.arrayBuffer())

    // Configure email transporter
    // You can use Gmail SMTP or any other email service
    // For Gmail, you'll need to use an App Password or OAuth2
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASSWORD, // Your email password or app password
      },
    })

    // Get file extensions
    const cvExtension = cvFile.name.split('.').pop() || 'pdf'
    const motivationLetterExtension = motivationLetterFile.name.split('.').pop() || 'pdf'

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@defendr.gg',
      replyTo: applicantEmail,
      to: 'defendrcompany@gmail.com',
      subject: `Internship Application: ${topicLabel} - ${fullName}`,
      html: `
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #D62555;">
              <h2 style="color: #D62555; margin-top: 0;">New Internship Application</h2>
              <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
                <p style="margin: 10px 0;"><strong style="color: #333;">Applicant:</strong> ${fullName}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> <a href="mailto:${applicantEmail}" style="color: #D62555; text-decoration: none;">${applicantEmail}</a></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Portfolio:</strong> <a href="${portfolioUrl}" style="color: #D62555; text-decoration: none;" target="_blank" rel="noopener noreferrer">${portfolioUrl}</a></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Internship Topic:</strong> <span style="color: #D62555;">${topicLabel}</span></p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Applied on:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}</p>
              </div>
              <div style="background-color: #fff3f3; padding: 15px; border-radius: 4px; margin: 15px 0;">
                <p style="margin: 0; color: #666;"><strong>Attachments:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px; color: #666;">
                  <li>CV.${cvExtension} (${(cvFile.size / 1024 / 1024).toFixed(2)} MB)</li>
                  <li>Motivation_Letter.${motivationLetterExtension} (${(motivationLetterFile.size / 1024 / 1024).toFixed(2)} MB)</li>
                </ul>
              </div>
              <p style="color: #666; margin-top: 20px;">Please find the CV and Motivation Letter attached to this email.</p>
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              This is an automated email from the Defendr jobs application form.<br>
              Please do not reply to this email.
            </p>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `CV_${fullName.replace(/\s+/g, '_')}_${Date.now()}.${cvExtension}`,
          content: cvBuffer,
          contentType: cvFile.type || 'application/pdf',
        },
        {
          filename: `Motivation_Letter_${fullName.replace(/\s+/g, '_')}_${Date.now()}.${motivationLetterExtension}`,
          content: motivationLetterBuffer,
          contentType: motivationLetterFile.type || 'application/pdf',
        },
      ],
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        topic: topicLabel,
        applicant: {
          fullName,
          email: applicantEmail,
          portfolioUrl: portfolioUrl || null,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send application email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
