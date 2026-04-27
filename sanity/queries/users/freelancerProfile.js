export const freelancerProfileQueries = {
  getByUserId: `*[_type == "freelancerProfile" && user._ref == $userId][0] {
    ...,
    "portfolioProjects": portfolioProjects[]{
      ...,
      "imageUrl": image.asset->url
    }
  }`,
};
