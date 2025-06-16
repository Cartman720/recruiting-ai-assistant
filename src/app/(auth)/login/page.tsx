import GoogleButton from "./google-button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center mb-2">
            Sign in using social accounts
          </h2>

          <div className="flex flex-col gap-2">
            <GoogleButton />
          </div>
        </div>
      </div>
    </div>
  );
}
