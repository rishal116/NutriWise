import GroupsPage from "./groups/page";
import SessionsPage from "./sessions/page";
import PostsPage from "./posts/page";
import ResourcesPage from "./resources/page";

export default function CommunitiesPage() {
  return (
    <div className="space-y-10">
      <GroupsPage preview />
      <SessionsPage preview />
      <PostsPage preview />
      <ResourcesPage preview />
    </div>
  );
}