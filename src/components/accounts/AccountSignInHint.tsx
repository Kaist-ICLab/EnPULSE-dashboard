/** Tells the researcher what a participant does with the account details they enter. */
const AccountSignInHint: React.FC = () => (
  <p className="text-sm text-gray-500">
    Participants sign in to the app with the configured email and passward, and join the campaign automatically.{" "}
    <b>Email addresses do not have to be real</b>.
  </p>
);

export default AccountSignInHint;
