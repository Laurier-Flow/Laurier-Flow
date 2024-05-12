import { MetadataRoute } from "next";

export default function robots() : MetadataRoute.Robots {
    return {
        rules : {
            userAgent: '*',
            allow: ['/', '/course/*', '/instructor/*', '/about', '/explore', 'privacy'],
            disallow: ['/change-password', 'confirm-signup', '/edit-user', '/profile']
        }
    }
}