import TestPage from "@/screens/TestPage";

const NFTDetailsPage = async ({ params }: {params: Promise<{ testId: string }> }) => {
  const { testId } = await params;

  return <TestPage testId={testId} />;
};

export default NFTDetailsPage;
