export async function checkImageProcessing(
  url: string
): Promise<boolean | undefined> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
    console.log(error);
  }
}
