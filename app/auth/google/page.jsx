import { redirect } from "next/navigation"

export default function GoogleOauth() {
    return redirect('https://accounts.google.com/o/oauth2/auth?client_id=824131161854-3hh6urnd61oqvgihf96hosl908k4932u.apps.googleusercontent.com&redirect_uri=https://api.bachduong.app/auth/google&response_code=code&scope=email openid profile&access_type=offline&prompt=consent&response_type=code&include_granted_scopes=true')
}