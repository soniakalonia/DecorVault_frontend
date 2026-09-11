export default function ProfilePage({ params }: { params: { userId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-espresso font-heading mb-4">Profile Information</h1>
      <div className="bg-white p-6 rounded-2xl shadow-elevation-1 border border-border">
        <p className="text-mocha-grey">User ID: {params.userId}</p>
      </div>
    </div>
  );
}
