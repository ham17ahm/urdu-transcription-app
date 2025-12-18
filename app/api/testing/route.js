export async function GET() {
  try {
    return Response.json({ note: "everythingn is coool" });
  } catch (error) {
    console.log(error);
  }
}
