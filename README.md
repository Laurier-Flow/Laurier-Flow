<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laurier Flow - Course Planning Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 0 20px;
        }

        h1,
        h2,
        h3 {
            color: #333;
            text-align: center;
        }

        p {
            color: #666;
        }

        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
        }

        .features {
            margin-top: 30px;
        }

        .features ul {
            list-style-type: none;
            padding: 0;
        }

        .features ul li {
            margin-bottom: 10px;
        }

        .demo-link {
            text-align: center;
            margin-top: 30px;
        }

        .deploy-button {
            text-align: center;
            margin-top: 30px;
        }

        .feedback-section {
            text-align: center;
            margin-top: 30px;
        }

        .feedback-section a {
            margin-right: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <a href="https://laurierflow.ca/">
            <img alt="Laurier Flow Landing Page" src="https://drive.google.com/uc?export=view&id=15rApSKbslcxtIecXiYfKICGwIW2dXhIL">
            <h1>Laurier Flow</h1>
        </a>

        <p align="center">Explore thousands of course and professor reviews from Laurier students</p>

        <div class="features">
            <h2>Features</h2>
            <ul>
                <li>Works across the entire <a href="https://nextjs.org">Next.js</a> stack</li>
                <ul>
                    <li>App Router</li>
                    <li>Pages Router</li>
                    <li>Middleware</li>
                    <li>Client</li>
                    <li>Server</li>
                    <li>It just works!</li>
                </ul>
                <li>supabase-ssr. A package to configure Supabase Auth to use cookies</li>
                <li>Styling with <a href="https://tailwindcss.com">Tailwind CSS</a></li>
                <li>Optional deployment with Supabase Vercel Integration and Vercel deploy</li>
                <ul>
                    <li>Environment variables automatically assigned to Vercel project</li>
                </ul>
            </ul>
        </div>

        <div class="demo-link">
            <p>View a fully working demo at <a href="https://demo-nextjs-with-supabase.vercel.app/">demo-nextjs-with-supabase.vercel.app</a></p>
        </div>

        <div class="deploy-button">
            <p><a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This%20starter%20configures%20Supabase%20Auth%20to%20use%20cookies%2C%20making%20the%20user's%20session%20available%20throughout%20the%20entire%20Next.js%20app%20-%20Client%20Components%2C%20Server%20Components%2C%20Route%20Handlers%2C%20Server%20Actions%20and%20Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a></p>
            <p>The above button will guide you through deploying the project to Vercel</p>
        </div>

        <div class="feedback-section">
            <p><a href="https://github.com/supabase/supabase/issues/new/choose">Feedback and issues</a></p>
        </div>

        <hr>

        <p align="center"><strong>Note:</strong> Laurier Flow is not affiliated with Wilfrid Laurier University. All reviews and opinions shared on this platform are the sole responsibility of the contributors.</p>
    </div>
</body>

</html>
