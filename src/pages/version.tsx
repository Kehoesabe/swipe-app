export default function Version() {
  const data = {
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "unset",
    gitSha: process.env.NEXT_PUBLIC_GIT_SHA ?? "unset",
    deployedAt: process.env.NEXT_PUBLIC_DEPLOYED_AT ?? "unset",
    scaleVersion: process.env.NEXT_PUBLIC_SCALE_VERSION ?? "unset",
    assessmentVersion: process.env.NEXT_PUBLIC_ASSESSMENT_VERSION ?? "unset",
    supabaseUrlSet: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL),
    supabaseAnonSet: Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  };
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
