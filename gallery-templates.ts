import type { ServerTemplate } from './types.ts';

// NOTE: The iconUrl fields contain pre-generated Base64 strings for each template icon.
export const galleryTemplates: ServerTemplate[] = [
  {
    id: "static-pixelcraft",
    serverName: "PixelCraft",
    vanityUrlSuggestion: "pixelcraft",
    tagline: "The ultimate hub for Minecraft builders, adventurers, and redstone engineers.",
    serverIconPrompt: "A vibrant, pixelated Minecraft grass block with a sword sticking out of it, set against a blocky landscape.",
    iconUrl: 'https://i.postimg.cc/x8pBvBT0/server-icon.png',
    likes: 0,
    dislikes: 0,
    roles: [
      { name: "Owner", permissions: ["Administrator"], color: "#E91E63", hoist: true },
      { name: "Admin", permissions: ["Manage Server", "Kick/Ban Members"], color: "#F44336", hoist: true },
      { name: "Moderator", permissions: ["Manage Messages", "Mute Members"], color: "#2196F3", hoist: true },
      { name: "Builder", permissions: ["Share Projects", "Use External Emojis"], color: "#4CAF50", hoist: true },
      { name: "Member", permissions: ["Read Messages", "Send Messages"], color: "#9E9E9E", hoist: false },
    ],
    categories: [
      {
        name: "🏰 Welcome",
        channels: [
          { name: "👋 ・ welcome", type: "text", topic: "Welcome new members!" },
          { name: "📜 ・ server-rules", type: "text", topic: "Read the server rules here." },
          { name: "📢 ・ announcements", type: "text", topic: "Important server announcements." },
        ]
      },
      {
        name: "💬 General",
        channels: [
          { name: "💬 ・ general-chat", type: "text", topic: "Talk about anything Minecraft related." },
          { name: "🧱 ・ show-your-builds", type: "text", topic: "Share your latest creations." },
          { name: "🤖 ・ bot-commands", type: "text", topic: "Use bot commands here." },
        ]
      },
      {
        name: "🎮 Gameplay",
        channels: [
          { name: "🤝 ・ looking-for-group", type: "text", topic: "Find others to play with." },
          { name: "🔊 ・ Survival VC", type: "voice", topic: "Voice chat for survival players." },
          { name: "🔊 ・ Creative VC", type: "voice", topic: "Voice chat for creative builders." },
        ]
      }
    ],
    serverSettings: {
      verificationLevel: "Low",
      explicitContentFilter: "All Members",
      defaultNotifications: "Mentions Only"
    },
    setupTutorial: [
        {
            title: "Step 1: Create Your Server",
            description: "First, you need a brand new server.\n* Click the `+` icon at the bottom of your server list in Discord.\n* Choose **Create My Own**.\n* Select **For a club or community**.\n* Give it a temporary name and click **Create**."
        },
        {
            title: "Step 2: Server Name & Icon",
            description: "Let's give your server its identity.\n* Right-click your new server's icon and go to **Server Settings** > **Overview**.\n* Change the **Server Name** to `PixelCraft`.\n* Click the **Upload Image** button to upload the icon you downloaded from this template."
        },
        {
            title: "Step 3: Create Roles",
            description: "Now, set up the roles for your community members.\n* In **Server Settings**, go to the **Roles** tab.\n* Click **Create Role** for each of the following roles:\n  * `Owner`: Color `#E91E63`, enable `Display role members separately`.\n  * `Admin`: Color `#F44336`, enable `Display role members separately`.\n  * `Moderator`: Color `#2196F3`, enable `Display role members separately`.\n  * `Builder`: Color `#4CAF50`, enable `Display role members separately`.\n  * `Member`: Color `#9E9E9E`, leave `Display role members separately` off.\n* Remember to drag the roles to reorder them from highest (Owner) to lowest (Member)."
        },
        {
            title: "Step 4: Build Channels & Categories",
            description: "Organize your server with the right channels.\n* Delete any default channels.\n* Right-click in the channel list area and choose **Create Category** for:\n  * `🏰 Welcome`\n  * `💬 General`\n  * `🎮 Gameplay`\n* Click the `+` next to each category name to create the text (#) and voice (🔊) channels listed in the template."
        },
        {
            title: "Step 5: Final Server Settings",
            description: "Let's configure the basic safety and notification settings.\n* In **Server Settings**, go to **Safety Setup**.\n* Set **Verification Level** to `Low`.\n* Set **Explicit Image Filter** to `Filter media content from all members`.\n* Go to **Overview** > **System Messages Channel** and select your `#welcome` channel."
        }
    ]
  },
  {
    id: "static-producers-booth",
    serverName: "Producer's Booth",
    vanityUrlSuggestion: "producers",
    tagline: "A community for music producers to collaborate, get feedback, and share secrets.",
    serverIconPrompt: "A sleek, minimalist vector logo of a music equalizer wave forming a circle, with a vinyl record in the center. Neon colors on a dark background.",
    iconUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA8ADwDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAwQHAgH/xAAwEAABBAEDAgMGBwAAAAAAAAABAgMEEQUAEiExQRNRYQYUIjJxgaGxwdHwFCRSkv/EABcBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAgEQEBAAIBBAIDAAAAAAAAAAABAhEDITEEEkFRYSIT/9oADAMBAAIRAxEAPwC9RRRQFFFFAUUUUBRRRQFFFFAz3UGoIOndLz9Q3BDr0ODt3oZAK1buSgYJIA5Unv2qQqk+MOkrnqvw3vFhtMllmVLDAS4+VEYQ+2tQ2gEklKVAcDnGR3q1Bf4Wavc114b2bVL8JMRyep8FhtW4JCHnGwQe4OzmrfSq94S6Ik+H3hu0acmTY8x2O/IcHktFI2rcUoJO4k7gFYVxxwAOVGrApQFFFFAUUUUBRRRQFFFFAUUUUBRRRQFFFFAj3zU1itBQi73eFCU4dqA+8lBUfQCetQ/wD3C0T98bb/AJ6f1V71bpLSd8fRcL7ZIUuSgAB55sFZA7Anvj2NVz91/hh+xbf+yP6oR4Zqf7haJ++Nt/z0/qo/uFon7423/PT+qof7r+GH7Ft/7I/qj91/DD9i2/9kftXlT4z1P8AcLRP3xtv+en9VH9wtE/fGbb/np+qof7r+GH7Ft/8AyR/VH7r+GH7Ft/7I/ajKnzPqf7haJ++Nt/z0/qo/uFon7423/PT+qof7r+GH7Ft/7I/qj91/DD9i2/8AZH7UZU+Z9T/cLRP3xtv+en9VQ9/13pKZp25xY+oYDjz0V5tptLwJWooggAeSSavH7r+GH7Ft/7I/aoW+eGfh1E05c5DPp+G26zFeWhSWQCFCiCAfIJBNGVPmasiirJpq0ajQhd1hIeCDlJU4tOPyIoq9g/M0UUUEnZ9LWSzvuPWuGphx07lqDy1En6qJFXRVEUUUUBRRRQFFFFAUUUUBRRRQf/9k=',
    likes: 0,
    dislikes: 0,
    roles: [
      { name: "Booth Owner", permissions: ["Administrator"], color: "#FF416C", hoist: true },
      { name: "Sound Engineer", permissions: ["Manage Server", "Kick/Ban Members"], color: "#FF4B2B", hoist: true },
      { name: "DJ", permissions: ["Manage Messages", "Move Members"], color: "#00B4DB", hoist: true },
      { name: "Artist", permissions: ["Share Music", "Stream"], color: "#22c1c3", hoist: true },
      { name: "Listener", permissions: ["Read Messages", "Connect"], color: "#95a5a6", hoist: false },
    ],
    categories: [
      {
        name: "🎧 The Booth",
        channels: [
          { name: "👋 ・ introductions", type: "text", topic: "Introduce yourself and your music style." },
          { name: "📜 ・ rules-and-info", type: "text", topic: "Community guidelines and info." },
          { name: "📰 ・ industry-news", type: "text", topic: "Latest news in the music world." },
        ]
      },
      {
        name: "🎶 Music & Feedback",
        channels: [
          { name: "🎵 ・ work-in-progress", type: "text", topic: "Share your WIPs and get feedback." },
          { name: "🔊 ・ feedback-lounge", type: "voice", topic: "Live feedback sessions." },
          { name: "🎹 ・ production-tips", type: "text", topic: "Share your favorite tips and tricks." },
        ]
      },
      {
        name: "🤝 Collaboration",
        channels: [
          { name: "🎤 ・ find-collabs", type: "text", topic: "Looking for a vocalist, producer, etc.?" },
          { name: "💻 ・ Studio A", type: "voice", topic: "Collaboration voice channel." },
        ]
      }
    ],
    serverSettings: {
      verificationLevel: "Medium",
      explicitContentFilter: "All Members",
      defaultNotifications: "Mentions Only"
    },
    setupTutorial: [
        {
            title: "Step 1: Create Your Server",
            description: "First, you need a brand new server.\n* Click the `+` icon at the bottom of your server list in Discord.\n* Choose **Create My Own**.\n* Select **For a club or community**.\n* Give it a temporary name and click **Create**."
        },
        {
            title: "Step 2: Server Name & Icon",
            description: "Let's give your server its identity.\n* Right-click your new server's icon and go to **Server Settings** > **Overview**.\n* Change the **Server Name** to `Producer's Booth`.\n* Click the **Upload Image** button to upload the icon you downloaded from this template."
        },
        {
            title: "Step 3: Create Roles",
            description: "Now, set up the roles for your community members.\n* In **Server Settings**, go to the **Roles** tab.\n* Click **Create Role** for each of the following roles:\n  * `Booth Owner`: Color `#FF416C`, enable `Display role members separately`.\n  * `Sound Engineer`: Color `#FF4B2B`, enable `Display role members separately`.\n  * `DJ`: Color `#00B4DB`, enable `Display role members separately`.\n  * `Artist`: Color `#22c1c3`, enable `Display role members separately`.\n  * `Listener`: Color `#95a5a6`, leave `Display role members separately` off.\n* Remember to drag the roles to reorder them from highest (Booth Owner) to lowest (Listener)."
        },
        {
            title: "Step 4: Build Channels & Categories",
            description: "Organize your server with the right channels.\n* Delete any default channels.\n* Right-click in the channel list area and choose **Create Category** for:\n  * `🎧 The Booth`\n  * `🎶 Music & Feedback`\n  * `🤝 Collaboration`\n* Click the `+` next to each category name to create the text (#) and voice (🔊) channels listed in the template."
        },
        {
            title: "Step 5: Final Server Settings",
            description: "Let's configure the basic safety and notification settings.\n* In **Server Settings**, go to **Safety Setup**.\n* Set **Verification Level** to `Medium`.\n* Set **Explicit Image Filter** to `Filter media content from all members`.\n* Go to **Overview** > **System Messages Channel** and select your `#introductions` channel."
        }
    ]
  }
];