'use client'

import React, { useState } from 'react'
import Typo from '@/components/ui/Typo'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // General Questions
  {
    question: 'What is DEFENDR.gg?',
    answer:
      'DEFENDR.gg is an all-in-one esports platform designed to create a safe, supportive, and engaging environment for esports enthusiasts, organizers, players, and fans. We offer esports tournaments, community engagement, and a dynamic leaderboard system to help players get noticed by professional teams, organizers to have interaction with advertisers and sponsors.',
    category: 'General Questions',
  },
  {
    question: 'What games are supported on DEFENDR.gg?',
    answer:
      "We support all competitive online games, including League of Legends, Valorant, Rocket League, FIFA, Tekken, Street Fighter, Free Fire, PUBG, and many more. If it's a competitive multiplayer game, you can play it on DEFENDR.gg!",
    category: 'General Questions',
  },
  {
    question: 'Is DEFENDR.gg free to use?',
    answer:
      'DEFENDR.gg operates on a freemium model, meaning you can access many features for free, but we also offer a premium membership with additional benefits.',
    category: 'Getting Started',
  },
  {
    question: 'How do I sign up and start playing?',
    answer:
      'Signing up is easy! You can register by visiting DEFENDR.gg/signup and entering your details or signing in using Google (Gmail) authentication.',
    category: 'Getting Started',
  },
  {
    question: 'Are there rewards for tournaments?',
    answer:
      'Yes! Every tournament on DEFENDR.gg comes with its own rewards, which vary based on the organizer. Players can win cash prizes, in-game items, or exclusive perks.',
    category: 'Tournaments, Rewards, and Leaderboards',
  },
  {
    question: 'How does the leaderboard system work?',
    answer:
      'Our dynamic leaderboard ranks players based on DEFENDR Blue Points, which help highlight the best players. This system is designed to help esports scouts discover new talent.',
    category: 'Tournaments, Rewards, and Leaderboards',
  },
  {
    question: 'Does DEFENDR.gg have fair play rules?',
    answer:
      'Yes! Each tournament has its own set of rules established by the organizer. Players must follow fair play guidelines, and anti-cheat measures are in place to ensure a competitive environment.',
    category: 'Rules, Policies, and Fair Play',
  },
  {
    question: 'Does DEFENDR.gg have a mobile app?',
    answer:
      'Not yet, but we are actively working on a mobile app to enhance your gaming experience. Stay tuned for updates!',
    category: 'Platform and Support',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'Our support team is available via the Contact Forum on the platform. If you have any issues or questions, feel free to reach out!',
    category: 'Platform and Support',
  },
  {
    question: 'How can I organize a tournament on DEFENDR.gg?',
    answer:
      "If you're an esports organizer and want to host a tournament on DEFENDR.gg, contact us at contact@defendr.gg. Our team will guide you through the process and provide the necessary tools to set up your event.",
    category: 'Tournament Organizers',
  },
  {
    question: 'Do you have social media accounts?',
    answer:
      'Yes! Stay connected with us and never miss an update. Follow DEFENDR.gg on: LinkedIn: DEFENDR.gg, Facebook: DEFENDR.gg, Instagram: @DEFENDR.gg, YouTube: DEFENDR.gg, TikTok: @DEFENDR.gg, X (Twitter): @DEFENDR_gg, Twitch: DEFENDR.gg, Discord: Join Our Community',
    category: 'Tournament Organizers',
  },
  {
    question: 'How can I join your Discord server?',
    answer:
      'You can join our official Discord community to connect with other players, get tournament updates, and chat with our team. Click the link below to join: Join DEFENDR.gg Discord',
    category: 'Tournament Organizers',
  },
  {
    question: 'Does DEFENDR.gg have an eCommerce store?',
    answer:
      'Yes! We have an eCommerce section where you can purchase exclusive gaming merchandise, esports gear, and digital content related to DEFENDR.gg. Stay tuned for special deals, limited-edition items, and in-game perks!',
    category: 'Tournament Organizers',
  },
  {
    question: 'Where can I access the DEFENDR.gg store?',
    answer:
      'You can visit our online store here (link coming soon). Keep an eye on our social media for launch updates!',
    category: 'Tournament Organizers',
  },
  {
    question: 'What products are available in the DEFENDR.gg store?',
    answer:
      'Our store offers a variety of esports-related products, including: Gaming Accessories (mousepads, keyboards, controllers), DEFENDR.gg Merchandise (t-shirts, hoodies, caps), Exclusive Tournament Items, Digital Content & In-Game Perks',
    category: 'Tournament Organizers',
  },
  {
    question: 'How do I purchase items from the DEFENDR.gg store?',
    answer:
      'Simply browse the store, add your favorite items to the cart, and proceed to checkout. We accept multiple payment methods for your convenience.',
    category: 'Tournament Organizers',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes! We provide worldwide shipping, so no matter where you are, you can get your hands on DEFENDR.gg merchandise and gaming gear. Shipping fees and delivery times may vary based on location.',
    category: 'Tournament Organizers',
  },
  {
    question: 'Can I play solo, or do I need a team?',
    answer:
      'DEFENDR.gg supports both solo players and teams. Depending on the tournament format, you can either compete individually or team up with friends.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  {
    question: 'How do I find teammates or join a team?',
    answer:
      'You can connect with other players through our Discord server, community forums, or in-platform matchmaking features designed to help you form teams.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  {
    question: 'Does DEFENDR.gg have a ranking system?',
    answer:
      'Yes! We use a dynamic leaderboard based on DEFENDR Blue Points, helping to showcase the top players and make scouting easier for esports teams.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  {
    question: 'How do I improve my ranking on DEFENDR.gg?',
    answer:
      'Your ranking improves by participating in tournaments, performing well, and earning DEFENDR Blue Points. Winning games, securing high placements, and playing consistently will help you climb the leaderboard.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  {
    question: 'What happens if I get matched against a cheater?',
    answer:
      'We take fair play seriously. If you suspect someone of cheating, you can report them through our live chat support or the in-platform reporting system. Every tournament also has its own rules and anti-cheat measures.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  {
    question: 'Can I stream my matches on Twitch or YouTube?',
    answer:
      'Absolutely! You are free to stream your gameplay. Some tournaments may have specific streaming rules, so always check the event guidelines.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  {
    question: 'Do you host both casual and professional tournaments?',
    answer:
      'Yes! DEFENDR.gg hosts casual tournaments for fun, as well as highly competitive events for esports pros and aspiring players.',
    category: 'Gaming & Esports on DEFENDR.gg',
  },
  // Tournament Types and Formats
  {
    question: 'What is a Single Elimination tournament?',
    answer:
      "A Single Elimination tournament means that if you lose a match, you are eliminated from the tournament. It's a fast-paced format used for quick competitions or finals.",
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What is a Double Elimination tournament?',
    answer:
      "In Double Elimination, you get a second chance after your first loss. You move to the Losers' Bracket, and if you lose again, you are eliminated.",
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What is a Round Robin tournament?',
    answer:
      "In a Round Robin format, every player/team competes against every other participant. Points are awarded based on wins, and the top players move to the next stage. It's often used in leagues.",
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What is a Swiss System tournament?',
    answer:
      'In a Swiss System tournament, players/teams compete in multiple rounds, always facing opponents with similar records. This format ensures balanced matchups without early eliminations.',
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What is a Group Stage + Playoffs format?',
    answer:
      'In this format, players first compete in groups, with the top teams advancing to a knockout playoff bracket. This is common in major esports events.',
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What is a Free-for-All (FFA) tournament?',
    answer:
      "In Free-for-All (FFA) tournaments, every player competes individually in the same match. It's common in Battle Royale (PUBG, Free Fire, Warzone) and fighting games (Tekken, Street Fighter).",
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What does Best of 1 (Bo1) mean?',
    answer:
      "Best of 1 (Bo1) means that a single match decides the winner. It's commonly used in early rounds or quick tournaments.",
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What does Best of 2 (Bo2) mean?',
    answer:
      'Best of 2 (Bo2) means two matches are played. If one team wins both, they win the series. If each team wins one match, it results in a draw (used in some leagues).',
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What does Best of 3 (Bo3) mean?',
    answer:
      'Best of 3 (Bo3) means the first team to win two matches wins the series. This is popular in playoffs and higher-stakes matches.',
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What does Best of 5 (Bo5) mean?',
    answer:
      "Best of 5 (Bo5) means the first team to win three matches wins the series. It's commonly used in finals or grand finals.",
    category: 'Tournament Types and Formats',
  },
  {
    question: 'What does Best of 7 (Bo7) mean?',
    answer:
      'Best of 7 (Bo7) means the first team to win four matches wins the series. This is usually reserved for major championship finals.',
    category: 'Tournament Types and Formats',
  },
  // Gaming & Esports In General
  {
    question: 'What is esports, and how does it work?',
    answer:
      'Esports (electronic sports) refers to competitive gaming where players or teams compete in organized tournaments for rankings, prizes, and recognition. DEFENDR.gg provides a platform for players to join tournaments, climb leaderboards, and showcase their skills in various online games.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What are esports tournaments, and how can I join one?',
    answer:
      'Esports tournaments are organized competitions where players battle for prizes, rankings, and esports career opportunities. You can join by signing up on DEFENDR.gg, checking the tournament schedule, and registering for an event that supports your game.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'How does matchmaking work in competitive gaming?',
    answer:
      'Matchmaking is the system that pairs players of similar skill levels in online matches. DEFENDR.gg ensures fair and balanced matchups to provide a competitive experience while helping players improve their rankings.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What is an MMR (Matchmaking Rating), and how does it affect my ranking?',
    answer:
      'MMR (Matchmaking Rating) is a hidden score used to rank players based on their skill level. The more you win, the higher your MMR and the better your matchmaking experience. While some tournaments may use MMR-based seeding, DEFENDR.gg primarily ranks players using DEFENDR Blue Points.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What are leaderboards, and how do they work?',
    answer:
      'Leaderboards track player performance and rankings based on wins, tournament placements, and activity. On DEFENDR.gg, the dynamic leaderboard highlights top players using the DEFENDR Blue Point system, helping esports scouts discover rising talent.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What is a Battle Royale game, and do you support them?',
    answer:
      'A Battle Royale game is a survival-based multiplayer format where players compete until only one remains (e.g., PUBG, Free Fire, Warzone). Yes, DEFENDR.gg supports Battle Royale esports tournaments, allowing players to compete solo or in squads.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What is a MOBA game, and can I compete in MOBA tournaments?',
    answer:
      'MOBA (Multiplayer Online Battle Arena) games involve team-based strategy where players control unique champions or heroes (e.g., League of Legends, Dota 2). Yes, DEFENDR.gg hosts MOBA esports tournaments, allowing teams to compete in Best of 1, Best of 3, and Best of 5 match formats.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What are FPS games, and do you host FPS tournaments?',
    answer:
      'FPS (First-Person Shooter) games involve fast-paced shooting mechanics, aiming skills, and team coordination (e.g., Valorant, CS:GO, Call of Duty). DEFENDR.gg regularly organizes FPS tournaments with different formats, including Search & Destroy, Deathmatch, and Team-based competitions.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What is crossplay, and do DEFENDR.gg tournaments support it?',
    answer:
      'Crossplay allows players from different platforms (PC, PlayStation, Xbox, Mobile) to compete together. Some tournaments on DEFENDR.gg are platform-specific, while others allow crossplay participation. Always check the tournament rules before joining!',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'What is esports coaching, and can I find coaches on DEFENDR.gg?',
    answer:
      'Esports coaching involves professional guidance to improve gameplay, strategy, and mechanics. While DEFENDR.gg primarily focuses on tournaments, we are working on features to connect players with coaches, analysts, and team scouts.',
    category: 'Gaming & Esports In General',
  },
  {
    question: 'How can I get scouted by an esports team?',
    answer:
      'The best way to get noticed is by competing in tournaments, climbing the DEFENDR.gg leaderboards, and earning DEFENDR Blue Points. Many esports teams scout top-ranked players for potential recruitment, so staying active in competitions increases your chances.',
    category: 'Gaming & Esports In General',
  },
  // Tournament Participation – Game-Specific FAQs
  {
    question: 'How can I participate in a League of Legends tournament on DEFENDR.gg?',
    answer:
      'To participate in a League of Legends (LoL) tournament, simply sign up on DEFENDR.gg, check the upcoming tournament schedule, and register for a match that fits your skill level. You can either play solo or join as a team. Format: LoL tournaments are often played in Best of 1 (Bo1), Best of 3 (Bo3), or Best of 5 (Bo5) formats, depending on the round. Team Requirements: Most tournaments require 5 players per team, and you must register your team in advance. Rules: Each tournament will have its own set of rules (e.g., champion bans, server regions), so make sure to check the event details before signing up.',
    category: 'Tournament Participation – Game-Specific FAQs',
  },
  {
    question: 'How can I participate in a Valorant tournament on DEFENDR.gg?',
    answer:
      'To join a Valorant tournament, register on DEFENDR.gg, choose an upcoming event, and sign up as a solo player or with your team. Format: Most Valorant tournaments are played in Best of 1 (Bo1) or Best of 3 (Bo3) formats for earlier rounds, and Best of 5 (Bo5) for finals. Team Requirements: You need 5 players per team to participate. You can either form your own team or join as a solo player and use matchmaking to find teammates. Competitive Play: Tournaments may have competitive and ranked modes, with a focus on strategic plays, smokes, and team coordination.',
    category: 'Tournament Participation – Game-Specific FAQs',
  },
  {
    question:
      'How can I participate in a Counter-Strike: Global Offensive (CS:GO) tournament on DEFENDR.gg?',
    answer:
      "To participate in a CS:GO tournament, simply sign up via DEFENDR.gg's platform and register for any upcoming event. Format: Matches are often played in Best of 1 (Bo1) or Best of 3 (Bo3) formats, with Best of 5 (Bo5) used for finals. Team Requirements: CS:GO tournaments require 5 players per team. You can join solo and find a team through the platform, or register a full team in advance. Rules: Be sure to review the specific tournament rules, such as map pool, side selection, and anti-cheat policies.",
    category: 'Tournament Participation – Game-Specific FAQs',
  },
  {
    question: 'How can I participate in a FIFA tournament on DEFENDR.gg?',
    answer:
      "If you're looking to join a FIFA tournament, simply sign up on DEFENDR.gg, pick an upcoming event, and register for a 1v1 match or team-based tournaments (depending on the event type). Format: FIFA tournaments typically use Best of 1 (Bo1) for early rounds, and Best of 3 (Bo3) or Best of 5 (Bo5) for finals. Game Settings: Make sure your in-game settings (e.g., difficulty, match duration) align with the tournament guidelines. Competition Type: Tournaments may be online or offline, and some may involve real-life esports teams scouting top players.",
    category: 'Tournament Participation – Game-Specific FAQs',
  },
  {
    question: 'How can I participate in a Rocket League tournament on DEFENDR.gg?',
    answer:
      'Rocket League tournaments on DEFENDR.gg allow you to compete with teams of 3 players. Sign up, check the tournament schedule, and join in on the action. Format: Rocket League tournaments are often held in Best of 3 (Bo3) or Best of 5 (Bo5) formats, with Best of 1 (Bo1) for qualification rounds. Team Requirements: 3 players per team are required, and teams should register in advance. Game Modes: You may play in Standard Mode or other variations like Rumble, Dropshot, or Hoops, depending on the event.',
    category: 'Tournament Participation – Game-Specific FAQs',
  },
  {
    question: 'How can I participate in a Tekken or Street Fighter tournament on DEFENDR.gg?',
    answer:
      "For Tekken and Street Fighter tournaments, sign up via DEFENDR.gg, select the relevant event, and get ready for some fighting action! Format: These tournaments typically use Best of 1 (Bo1) for early rounds, and Best of 3 (Bo3) or Best of 5 (Bo5) for finals. Rules: Character bans, map selection, and time limits may apply. Always review the tournament rules to ensure you're prepared. Solo Play: Most fighting games are 1v1, and players can compete solo, either in bracket-style or round-robin formats.",
    category: 'Tournament Participation – Game-Specific FAQs',
  },
  // Business Collaborations – FAQ
  {
    question: 'How can a gaming gear store collaborate with DEFENDR.gg?',
    answer:
      "If you're a gaming gear store and want to collaborate with DEFENDR.gg, we offer multiple partnership opportunities, such as: Featured Product Listings: Showcase your products in our online store or tournament events. Co-Branded Tournaments: Sponsor tournaments and promote your brand while connecting with a highly engaged gaming audience. Exclusive Discounts: Offer special discounts and promotions to players participating in DEFENDR.gg events. To explore a partnership, please contact us at contact@defendr.gg and share your ideas!",
    category: 'Business Collaborations – FAQ',
  },
  {
    question: 'Can my business advertise on DEFENDR.gg?',
    answer:
      "Yes, DEFENDR.gg offers advertising opportunities for businesses to promote their products or services to our gaming community. Here's how you can get involved: Banner Ads: Place ads on our website or in tournament streams. Sponsored Content: Feature your products, services, or events through sponsored articles or videos. Custom Promotions: Collaborate on special promotions, such as branded challenges or exclusive events. To get started with advertising, please contact us at contact@defendr.gg and provide details about your business and goals.",
    category: 'Business Collaborations – FAQ',
  },
  {
    question: 'How can my business run a giveaway with DEFENDR.gg?',
    answer:
      "DEFENDR.gg regularly partners with brands for giveaways to engage our community. Here's how we can collaborate: Prize Sponsorship: Your company can sponsor tournament prizes, exclusive giveaways, or in-game rewards for players. Social Media Campaigns: We can host giveaways on our social media platforms, Facebook, Instagram, Twitter (X), and Discord, where your brand can be featured. Event Giveaways: Sponsor giveaways during live events or streamed tournaments. If you're interested in running a giveaway, reach out to us at contact@defendr.gg, and we'll discuss the best way to promote your brand.",
    category: 'Business Collaborations – FAQ',
  },
  {
    question: 'Can I collaborate with DEFENDR.gg to offer exclusive in-game items or skins?',
    answer:
      'Absolutely! We offer opportunities for companies to collaborate on exclusive in-game items, skins, or cosmetics tied to tournaments or promotions. Branded Skins/Items: Work with us to create unique, branded in-game items that players can earn or purchase. Exclusive Bundles: Offer special item bundles as tournament rewards or promotional giveaways. Contact us at contact@defendr.gg to explore how we can make your in-game item vision a reality.',
    category: 'Business Collaborations – FAQ',
  },
  {
    question: 'How can I sponsor a tournament on DEFENDR.gg?',
    answer:
      "Tournament sponsorships are a great way for businesses to gain exposure while supporting the gaming community. As a sponsor, you can: Provide Prizes: Supply exclusive prizes or rewards for winners, including gaming gear or in-game currency. Branding Opportunities: Get your logo on tournament banners, streams, and social media posts. Custom Campaigns: Create custom branded challenges or events that are unique to your company. To sponsor a tournament, contact us at contact@defendr.gg, and we'll discuss the options that work best for your brand.",
    category: 'Business Collaborations – FAQ',
  },
  {
    question: 'Can I feature my game or gaming service on DEFENDR.gg?',
    answer:
      "Yes, DEFENDR.gg is always open to featuring new and exciting games or gaming services! You can: Game Features: Get your game highlighted in tournaments or in our community events. Service Integrations: Promote your gaming-related services, such as coaching, streaming tools, or game guides. To feature your game or service, reach out to us at contact@defendr.gg, and we'll discuss the best way to integrate it into our platform.",
    category: 'Business Collaborations – FAQ',
  },
  {
    question: 'What does DEFENDR.gg offer if I organize a tournament on your platform?',
    answer:
      "When you organize a tournament on DEFENDR.gg, you get a complete set of tools and services to make your event successful and memorable. Here's what we offer to tournament organizers: Customizable Tournament Pages: Create a unique tournament page with your own branding, rules, format, and prizes to engage players and spectators. Easy Registration: Simplify the player registration process and manage teams, brackets, and match scheduling effortlessly. Automated Matchmaking & Brackets: Our platform provides automated matchmaking and dynamic bracket generation to ensure smooth tournament progression. Live Support: We offer live chat support to assist both tournament organizers and players, resolving any issues quickly and efficiently. Promotional Exposure: Your tournament will be promoted across our platform, social media channels, and within our community to attract more participants and spectators. Monetization Opportunities: You can create prize pools, sell tickets, or offer premium entry fees for exclusive events. Analytics & Reporting: Get access to real-time tournament data, including player stats, registration numbers, and event performance metrics to track success. Sponsorship & Prizes: We can help you secure sponsorships and prizes for your tournament, providing additional value for your participants. Digital Marketing Strategy & Branding: We offer a full digital marketing strategy, including branding, event design, and custom promotional content. Our team will work with you to craft targeted marketing campaigns to maximize visibility and attract players and viewers to your tournament. If you're ready to organize your tournament or want to learn more about the services we provide, contact us at contact@defendr.gg",
    category: 'Business Collaborations – FAQ',
  },
]

const categories = [
  'General Questions',
  'Getting Started',
  'Tournaments, Rewards, and Leaderboards',
  'Rules, Policies, and Fair Play',
  'Platform and Support',
  'Tournament Organizers',
  'Gaming & Esports on DEFENDR.gg',
  'Tournament Types and Formats',
  'Gaming & Esports In General',
  'Tournament Participation – Game-Specific FAQs',
  'Business Collaborations – FAQ',
]

export default function FAQPage(): React.JSX.Element {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQs =
    selectedCategory === 'All' ? faqData : faqData.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#161616]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Typo
            as="h1"
            fontFamily="poppins"
            fontVariant="h1"
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </Typo>
          <Typo
            as="p"
            fontFamily="poppins"
            fontVariant="p2"
            className="text-gray-300 max-w-3xl mx-auto"
          >
            Find answers to common questions about DEFENDR.gg, tournaments, esports, and more.
          </Typo>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Category Filter */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 sticky top-8">
              <Typo
                as="h2"
                fontFamily="poppins"
                fontVariant="h5"
                className="text-white font-semibold mb-4"
              >
                Categories
              </Typo>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-poppins font-medium transition-all duration-200 ${
                    selectedCategory === 'All'
                      ? 'bg-defendrRed text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  All Questions
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-poppins font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-defendrRed text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - FAQ Items */}
          <div className="flex-1 space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-all duration-200"
                >
                  <Typo
                    as="h3"
                    fontFamily="poppins"
                    fontVariant="h5"
                    className="text-white font-semibold pr-4"
                  >
                    {faq.question}
                  </Typo>
                  {openItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-defendrRed flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {openItems.has(index) && (
                  <div className="px-6 pb-4 border-t border-gray-700">
                    <Typo
                      as="div"
                      fontFamily="poppins"
                      fontVariant="p3"
                      className="text-gray-300 pt-4 leading-relaxed"
                    >
                      {faq.answer}
                    </Typo>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-defendrRed/20 to-defendrBlue/20 rounded-lg p-8 border border-gray-700">
            <Typo as="h2" fontFamily="poppins" fontVariant="h3" className="text-white mb-4">
              Still Have Questions?
            </Typo>
            <Typo as="p" fontFamily="poppins" fontVariant="p3" className="text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help!
            </Typo>
            <a
              href="mailto:contact@defendr.gg"
              className="inline-flex items-center px-6 py-3 bg-defendrRed text-white font-poppins font-semibold rounded-lg hover:bg-defendrRed/90 transition-all duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
