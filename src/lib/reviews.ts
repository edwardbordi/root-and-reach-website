/**
 * Cristina's Google reviews, read and sorted by what each one praises, for
 * the filterable reviews section on the home page.
 *
 * Source: Root & Reach Creative Agency LLC's Google Business Profile, copied
 * 2026-10-03 (5.0 stars from 21 reviews). Quotes are the reviewers' own words,
 * spelling and all; long ones are trimmed with "…" and never reworded. Names
 * are shortened to first name + last initial. To add a review: copy it from
 * Google, tag it with the themes it actually mentions, and bump the rating
 * snapshot below.
 *
 * Left out on purpose: one review from a reviewer who shares Cristina's last
 * name. A relative's review needs a disclosed connection to be shown as a
 * testimonial (see OPEN-ITEMS 4). It still counts in Google's own rating.
 */

export const REVIEW_SNAPSHOT = {
  rating: 5.0,
  /** Not shown on the site (it changes); kept for reference. */
  count: 21,
  /** Opens her Google reviews. Swap for the profile's own share link when we have it (OPEN-ITEMS 13). */
  url: "https://www.google.com/search?q=Root+and+Reach+creative+agency+LLC+reviews",
  asOf: "2026-10-03",
} as const;

export const REVIEW_THEMES = [
  { id: "comfortable", label: "Comfortable on camera" },
  { id: "fun", label: "Fun to work with" },
  { id: "creative", label: "Creative ideas" },
  { id: "strategy", label: "Strategy & planning" },
  { id: "results", label: "Real results" },
  { id: "easy", label: "Easy & on time" },
] as const;

export type ReviewTheme = (typeof REVIEW_THEMES)[number]["id"];

export interface Review {
  name: string;
  /** Their business, or "Model" for people Cristina directed on a shoot. */
  role?: string;
  quote: string;
  themes: ReviewTheme[];
}

// Ordered for the default view: the first six are what most visitors see.
export const REVIEWS: Review[] = [
  {
    name: "Cierra S.",
    role: "Model",
    quote:
      "cristina is literally the best to work with as a model! i was nervous going into it, but she made it such a comfortable and wonderful experience. she’s so kind, funny, and really thinks about the content she wants to make.",
    themes: ["comfortable", "fun", "creative"],
  },
  {
    name: "Toni P.",
    role: "Salon Tomai",
    quote:
      "Cristina is so fun to work with and is able to make people feel comfortable with being on camera with her bubbly personality. She gets content filmed, edited, and ready to post in a timely matter! Thank you so much for helping Salon Tomai get noticed!",
    themes: ["comfortable", "fun", "easy", "results"],
  },
  {
    name: "Brio Beauty",
    quote:
      "She has amazing ideas and thinks of things I wouldn’t even have thought of to showcase my business… my social media interactions and engagement has improved dramatically since working with her💪❤️ she truly cares and puts heart and soul in every time we meet!",
    themes: ["creative", "results"],
  },
  {
    name: "Jaimie M.",
    quote:
      "She gives great creative suggestions and insight for content ideas. In addition to that she made me feel so comfortable and confident as someone that isn’t used to being filmed. Lastly I really appreciate her patience to teach me how optimize my social media presence with less time.",
    themes: ["comfortable", "creative", "strategy"],
  },
  {
    name: "S. Ryback",
    quote:
      "Cristina did a great job to get us off the ground with a plan for messaging, creative content and a systematic approach that has really helped our business.",
    themes: ["strategy", "results"],
  },
  {
    name: "Marissa",
    quote:
      "Working with Cristina at Root and Reach was such a great experience! She made the whole process easy and fun, and the videos were flattering and well crafted. Would 100% work with her again.",
    themes: ["comfortable", "fun", "easy"],
  },
  {
    name: "Andrea L.",
    role: "Model",
    quote:
      "Christina created an environment that felt both comfortable and inspiring… She has a natural ability to make you feel safe, secure, and confident, which allows the creative process to flow effortlessly… In a world where anyone can pick up a camera, Christina brings something far more valuable. A true creative vision.",
    themes: ["comfortable", "creative"],
  },
  {
    name: "Brittainy B.",
    role: "Brittainy Bishop LLC",
    quote:
      "I have gotten so many good leads and it’s so easy to work with Cristina. Cristina is professional and attentive to my needs. She organized a great photo shoot which provided me with a ton of content I could use for my social media.",
    themes: ["results", "easy"],
  },
  {
    name: "Lisa S.",
    quote:
      "Root and Reach helped us find our footing and give us wings! We are in full appreciation of our new social media content. Not only do you have fun but you also get a lot done and learn in the process.",
    themes: ["fun", "results"],
  },
  {
    name: "Stacey S.",
    quote:
      "Root and Reach created a comfortable environment for this new content creator and captured some amazing photos!",
    themes: ["comfortable"],
  },
  {
    name: "Brenda A.",
    quote:
      "Her organizational skills are top-notch, which made the entire process smooth and efficient. She is incredibly approachable and easy to communicate with, always ensuring that our ideas and needs are not only heard but incorporated into the final product… Her ability to blend creativity with strategic planning makes Root & Reach Creative Agency a standout choice.",
    themes: ["strategy", "creative", "easy", "results"],
  },
  {
    name: "Kimberly O.",
    quote:
      "Cristina is a great communicator, easy to work with, and quick to deliver high-quality content. Their imagery has been a valuable part of our marketing campaigns and always arrives when needed. Highly recommend!",
    themes: ["easy", "results"],
  },
  {
    name: "Shuana",
    role: "Let’s Talk Naturally",
    quote:
      "She knows how to actively listen both to the things said and unsaid. She has a gift for reading between the lines and she knows how to translate your requests into a creative masterpiece.",
    themes: ["creative"],
  },
  {
    name: "Ciara C.",
    quote:
      "Cristina and her team is amazing to work with! She wants us all to win and that’s what makes her a strategic content creator and business development partner.",
    themes: ["strategy", "results"],
  },
  {
    name: "Daryle S.",
    role: "Mobile event DJ van service",
    quote:
      "Christina Vann at Root & Reach Creative Agency has a real talent for social media styling and creating a cohesive, professional presence. She has a great eye for design and understands how to bring a brand to life visually while keeping the content authentic and engaging.",
    themes: ["creative", "strategy"],
  },
  {
    name: "George K.",
    quote:
      "Cristina is great to work with. She immediately understood our objectives and created great content to accomplish them. Love having her as part of the creative team.",
    themes: ["strategy", "creative"],
  },
  {
    name: "Matt M.",
    quote:
      "Christina has been amazing to work with she makes creative content and makes it easy for me to simply upload it and be done, would highly recommend her!",
    themes: ["easy", "creative"],
  },
  {
    name: "Vidhi S.",
    role: "Dental office",
    quote:
      "She is very professional, always work with our schedules as it’s always so unpredictable in dental office but she doesn’t loose her patience and does great work.",
    themes: ["easy"],
  },
  {
    name: "Kristen N.",
    role: "Hairstylist & model",
    quote:
      "I was a model for Cristina for her content photoshoot with Wei’s day spa. It was fun, she is so creative and has a good eye for what customers are looking for.",
    themes: ["fun", "creative"],
  },
  {
    name: "Chun W.",
    quote: "I love working with Cristina! She is very professional, efficiently, responsibly and friendly!!! Amazing work!!!",
    themes: ["easy"],
  },
];
