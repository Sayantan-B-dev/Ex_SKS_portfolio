insert into public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  published_at
)
values
(
  'When the Crowd Sings Back',
  'when-the-crowd-sings-back',
  'The quiet, electric second when a room of strangers becomes one choir.',
  'Every live show has a turning point. The band locks in, the lights fall just right, and the audience gives the song back to you. That exchange is why we keep travelling, rehearsing, and showing up with everything we have.',
  '/images/hero_samrat_live.webp',
  now() - interval '2 days'
),
(
  'A Song Finds Its Shape',
  'a-song-finds-its-shape',
  'From a first melody in the studio to the final note under stage lights.',
  'A song rarely arrives finished. It grows through late-night ideas, patient musicians, and the small decisions that make a performance feel honest. The best version is the one that leaves room for people to bring their own story.',
  '/images/singing_on_stage_background_fire.webp',
  now() - interval '7 days'
)
on conflict (slug) do nothing;
