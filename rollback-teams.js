const mongoose = require('mongoose')

// Team model definition
const teamSchema = new mongoose.Schema(
  {
    //team information
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: '1754657295408-coverbg.jpg' },
    profileImage: { type: String, default: '1754906095111-avatarTeam.jpg' },

    //social media
    facebook: { type: String },
    twitter: { type: String },
    discord: { type: String },
    instagram: { type: String },
    datecreation: { type: Date, default: Date.now(), timestamps: true },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    prizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prize',
      },
    ],

    bluePoints: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    lastPlayed: {
      type: Date,
      default: Date.now,
      timestamps: true,
    },

    teamowner: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          default: 'owner',
        },
      },
    ],
    teamroster: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    invitations: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined'],
          default: 'pending',
        },
        role: {
          type: String,
          default: 'member',
        },
      },
    ],
    requests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    archived: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    country: {
      type: String,
    },
    // added attributes
    isTeamPublic: {
      type: Boolean,
      default: true,
    },
    isJoinRequestsAllowed: {
      type: Boolean,
      default: true,
    },
    isTeamNotificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const Team = mongoose.model('Team', teamSchema)

// Rollback function to revert teams to old structure
async function rollbackTeams() {
  try {
    console.log('🔄 Starting team rollback...')
    console.log('📊 Connecting to database...')

    // Connect to your MongoDB database
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://admin:6fa6g1j6ik13%40nb5t86z2g5b%236ze12@57.128.222.80:5000/test?authSource=admin',
    )
    console.log('✅ Connected to database')

    // Get all teams
    const teams = await Team.find({})
    console.log(`📋 Found ${teams.length} teams to rollback`)

    let rolledBackCount = 0
    let errorCount = 0
    const errors = []

    for (const team of teams) {
      try {
        let needsRollback = false
        const updates = {}

        console.log(`\n🔄 Processing team: ${team.name} (${team._id})`)

        // 1. Rollback teamowner structure (objects -> strings)
        if (Array.isArray(team.teamowner) && team.teamowner.length > 0) {
          if (typeof team.teamowner[0] === 'object' && team.teamowner[0].user) {
            console.log('  📝 Converting teamowner from objects to strings')
            updates.teamowner = team.teamowner.map(owner => owner.user)
            needsRollback = true
          }
        }

        // 2. Rollback teamroster structure (objects -> strings)
        if (Array.isArray(team.teamroster)) {
          const hasObjectMembers = team.teamroster.some(
            member => typeof member === 'object' && member.user,
          )
          if (hasObjectMembers) {
            console.log('  📝 Converting teamroster from objects to strings')
            const newRoster = team.teamroster.map(member => {
              if (typeof member === 'object' && member.user) {
                return member.user // Convert back to string
              }
              return member // Already a string
            })
            updates.teamroster = newRoster
            needsRollback = true
          }
        }

        // 3. Rollback typo fix: archived -> achieved
        if (team.archived !== undefined) {
          console.log('  📝 Rolling back typo fix: archived -> achieved')
          updates.achieved = team.archived
          updates.$unset = { archived: 1 }
          needsRollback = true
        }

        // 4. Remove new fields (optional - you might want to keep them)
        const fieldsToRemove = [
          'facebook',
          'twitter',
          'discord',
          'instagram',
          'phone',
          'email',
          'website',
          'country',
        ]
        fieldsToRemove.forEach(field => {
          if (team[field] !== undefined) {
            updates.$unset = updates.$unset || {}
            updates.$unset[field] = 1
            needsRollback = true
          }
        })

        // 5. Update the team if needed
        if (needsRollback) {
          await Team.findByIdAndUpdate(team._id, updates)
          rolledBackCount++
          console.log(`  ✅ Successfully rolled back team: ${team.name}`)
        } else {
          console.log(`  ⏭️  Team ${team.name} already in old format`)
        }
      } catch (error) {
        errorCount++
        const errorMsg = `❌ Error rolling back team ${team.name} (${team._id}): ${error.message}`
        console.log(errorMsg)
        errors.push(errorMsg)
      }
    }

    console.log('\n📊 Rollback Summary:')
    console.log(`✅ Successfully rolled back: ${rolledBackCount} teams`)
    console.log(`❌ Errors: ${errorCount} teams`)

    if (errors.length > 0) {
      console.log('\n🚨 Errors encountered:')
      errors.forEach(error => console.log(`  ${error}`))
    }

    console.log('\n🎉 Rollback completed!')
  } catch (error) {
    console.error('💥 Rollback failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from database')
  }
}

// Main execution
async function main() {
  console.log('⚠️  WARNING: This will rollback your teams to the old structure!')
  console.log('📋 Make sure you have a backup before proceeding.')
  console.log('')

  // In a real scenario, you might want to add a confirmation prompt here
  // For now, we'll just run the rollback

  await rollbackTeams()
}

// Run the rollback
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🏁 Rollback script finished')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Script failed:', error)
      process.exit(1)
    })
}

module.exports = { rollbackTeams }
