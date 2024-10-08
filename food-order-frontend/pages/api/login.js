import { serialize } from "cookie";
import { routes } from "../../routes";

export default async (req,res)=>{

    let host = req.headers.host
    if (req.method === 'POST')
    {
        const {name,password } = req.body;
        console.log(name,password )
        if( (name ==='' || password ==='') || (name ===undefined || password ===undefined ) )
        {
            return res.status(403).json({ success: `you cannot leave any field empty` ,status:403});
        }
        const body = req.body;
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
            "name": name,
            "password": password
        });
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        let login_fetcher = await fetch(`${routes.LOGIN}`, requestOptions)
        console.log('login fetcher',login_fetcher?.status)
        if( login_fetcher?.status !== 200 )
        {
            return res.status(500).json({
                success: 'credentials are wrong',
                status:500
            });
        }
        login_fetcher = await login_fetcher.json();
        console.log(login_fetcher?.access_token)

        let httpOnlyCookie = serialize(
            'access_token', login_fetcher?.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 24 *60* 60 * 3,
                sameSite: 'strict',
                path: '/'
            }
        )
        //Cookies.set('user_token', login_fetcher?.access_token, { expires: 60*60*3 });
        res.setHeader('set-Cookie', httpOnlyCookie);
        return res.status(200).json({
            username:login_fetcher?.username,
            success:'logged in successfully',
            status:200
        });
    }
    else{
        return res.status(500).json({
            success: `method ${req.method} is not supported`,
            status:500
        });
    }
}