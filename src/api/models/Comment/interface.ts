export default interface Comment {
  comment: string;
  rating: number;
  createAt: Date;
  post: any;
  user: any;
  populate: any;
}
