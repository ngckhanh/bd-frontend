import { redirect } from "next/navigation"

export default function GoogleOauth() {
    return redirect('https://accounts.google.com/o/oauth2/auth?client_id=613079491877-2okfkc757h5ea0njpm6b7s7anec815la.apps.googleusercontent.com&redirect_uri=https://api.bachduong.app/auth/google&response_type=code&scope=email%20openid%20profile&access_type=offline&prompt=consent&include_granted_scopes=true')
}