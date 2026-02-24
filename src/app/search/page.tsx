import React, { Suspense } from "react";
import PageContent from "./PageContent";

const page = () => {
  return (
    <Suspense fallback={<div className="pt-24 px-4">Loading Search...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default page;
