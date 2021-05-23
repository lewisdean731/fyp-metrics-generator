type Project = {
  projectDependencies: {
    directDependencies: dependency[];
  };
  yellowWarningPeriod: number;
  redWarningPeriod: number;
};

type dependency = {
  name: string;
  version: string;
  release_date: Date | number;
  latest_version: string;
  latest_release_date: Date | number;
  next_version: string;
  next_release_date: Date | number;
};
