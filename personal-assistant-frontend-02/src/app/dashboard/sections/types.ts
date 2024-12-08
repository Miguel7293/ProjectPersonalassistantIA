export interface Project {
  project_id: number;
  name: string;
  start_date: string;
  end_date: string;
  max_points: number;
  image_url: string;
}

export interface Collaborator {
  email: string;
  image_url: string;
}

