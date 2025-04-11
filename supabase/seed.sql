-- Seed data for the freelancer marketplace

-- Categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
('11111111-1111-1111-1111-111111111111', 'Programming & Tech', 'programming-tech', 'Software development, web development, and technical services', 'code'),
('22222222-2222-2222-2222-222222222222', 'Graphics & Design', 'graphics-design', 'Graphic design, illustrations, and visual content creation', 'image'),
('33333333-3333-3333-3333-333333333333', 'Writing & Translation', 'writing-translation', 'Content writing, translation, and proofreading services', 'file-text'),
('44444444-4444-4444-4444-444444444444', 'Digital Marketing', 'digital-marketing', 'SEO, social media, and digital marketing services', 'trending-up'),
('55555555-5555-5555-5555-555555555555', 'Video & Animation', 'video-animation', 'Video editing, animation, and motion graphics', 'video'),
('66666666-6666-6666-6666-666666666666', 'Music & Audio', 'music-audio', 'Music production, voice overs, and audio services', 'music'),
('77777777-7777-7777-7777-777777777777', 'Business', 'business', 'Business consulting, legal, and financial services', 'briefcase'),
('88888888-8888-8888-8888-888888888888', 'Lifestyle', 'lifestyle', 'Health, fitness, and personal services', 'heart');

-- Subcategories
INSERT INTO categories (id, name, slug, description, icon, parent_id) VALUES
-- Programming & Tech subcategories
('11111111-1111-1111-1111-111111111112', 'Web Development', 'web-development', 'Website development and programming', 'globe', '11111111-1111-1111-1111-111111111111'),
('11111111-1111-1111-1111-111111111113', 'Mobile Development', 'mobile-development', 'iOS and Android app development', 'smartphone', '11111111-1111-1111-1111-111111111111'),
('11111111-1111-1111-1111-111111111114', 'Game Development', 'game-development', 'Game design and development', 'gamepad', '11111111-1111-1111-1111-111111111111'),
('11111111-1111-1111-1111-111111111115', 'Desktop Applications', 'desktop-applications', 'Software for Windows, Mac, and Linux', 'monitor', '11111111-1111-1111-1111-111111111111'),
('11111111-1111-1111-1111-111111111116', 'AI & Machine Learning', 'ai-ml', 'Artificial intelligence and machine learning services', 'cpu', '11111111-1111-1111-1111-111111111111'),

-- Graphics & Design subcategories
('22222222-2222-2222-2222-222222222223', 'Logo Design', 'logo-design', 'Professional logo design services', 'pen-tool', '22222222-2222-2222-2222-222222222222'),
('22222222-2222-2222-2222-222222222224', 'Web Design', 'web-design', 'Website UI/UX design', 'layout', '22222222-2222-2222-2222-222222222222'),
('22222222-2222-2222-2222-222222222225', 'Illustration',  '22222222-2222-2222-2222-222222222222'),
('22222222-2222-2222-2222-222222222225', 'Illustration', 'illustration', 'Custom illustrations and digital art', 'feather', '22222222-2222-2222-2222-222222222222'),
('22222222-2222-2222-2222-222222222226', 'Branding', 'branding', 'Complete brand identity design', 'award', '22222222-2222-2222-2222-222222222222'),
('22222222-2222-2222-2222-222222222227', 'Social Media Design', 'social-media-design', 'Graphics for social media platforms', 'instagram', '22222222-2222-2222-2222-222222222222'),

-- Writing & Translation subcategories
('33333333-3333-3333-3333-333333333334', 'Content Writing', 'content-writing', 'Blog posts, articles, and web content', 'file-text', '33333333-3333-3333-3333-333333333333'),
('33333333-3333-3333-3333-333333333335', 'Translation', 'translation', 'Language translation services', 'globe', '33333333-3333-3333-3333-333333333333'),
('33333333-3333-3333-3333-333333333336', 'Proofreading & Editing', 'proofreading-editing', 'Grammar checking and content editing', 'check', '33333333-3333-3333-3333-333333333333'),
('33333333-3333-3333-3333-333333333337', 'Resume Writing', 'resume-writing', 'Professional resume and CV writing', 'file', '33333333-3333-3333-3333-333333333333'),

-- Digital Marketing subcategories
('44444444-4444-4444-4444-444444444445', 'SEO', 'seo', 'Search engine optimization services', 'search', '44444444-4444-4444-4444-444444444444'),
('44444444-4444-4444-4444-444444444446', 'Social Media Marketing', 'social-media-marketing', 'Marketing on social platforms', 'share-2', '44444444-4444-4444-4444-444444444444'),
('44444444-4444-4444-4444-444444444447', 'Email Marketing', 'email-marketing', 'Email campaign management', 'mail', '44444444-4444-4444-4444-444444444444'),
('44444444-4444-4444-4444-444444444448', 'PPC Advertising', 'ppc-advertising', 'Pay-per-click ad campaigns', 'dollar-sign', '44444444-4444-4444-4444-444444444444');

-- Skills
INSERT INTO skills (id, name, category_id) VALUES
-- Programming skills
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'JavaScript', '11111111-1111-1111-1111-111111111112'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'React', '11111111-1111-1111-1111-111111111112'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac', 'Node.js', '11111111-1111-1111-1111-111111111112'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad', 'Python', '11111111-1111-1111-1111-111111111112'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae', 'PHP', '11111111-1111-1111-1111-111111111112'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf', 'WordPress', '11111111-1111-1111-1111-111111111112'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaag', 'Swift', '11111111-1111-1111-1111-111111111113'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaah', 'Kotlin', '11111111-1111-1111-1111-111111111113'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaai', 'React Native', '11111111-1111-1111-1111-111111111113'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaj', 'Flutter', '11111111-1111-1111-1111-111111111113'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaak', 'Unity', '11111111-1111-1111-1111-111111111114'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaal', 'Unreal Engine', '11111111-1111-1111-1111-111111111114'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaam', 'TensorFlow', '11111111-1111-1111-1111-111111111116'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaan', 'PyTorch', '11111111-1111-1111-1111-111111111116'),

-- Design skills
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba', 'Photoshop', '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Illustrator', '22222222-2222-2222-2222-222222222222'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'Figma', '22222222-2222-2222-2222-222222222224'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbd', 'Sketch', '22222222-2222-2222-2222-222222222224'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe', 'UI/UX Design', '22222222-2222-2222-2222-222222222224'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbf', 'Logo Design', '22222222-2222-2222-2222-222222222223'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbg', 'Digital Illustration', '22222222-2222-2222-2222-222222222225'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbh', 'Character Design', '22222222-2222-2222-2222-222222222225'),

-- Writing skills
('cccccccc-cccc-cccc-cccc-ccccccccccca', 'Content Writing', '33333333-3333-3333-3333-333333333334'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Copywriting', '33333333-3333-3333-3333-333333333334'),
('cccccccc-cccc-cccc-cccc-cccccccccccb', 'Technical Writing', '33333333-3333-3333-3333-333333333334'),
('cccccccc-cccc-cccc-cccc-cccccccccccf', 'English to Spanish', '33333333-3333-3333-3333-333333333335'),
('cccccccc-cccc-cccc-cccc-cccccccccccd', 'English to Arabic', '33333333-3333-3333-3333-333333333335'),
('cccccccc-cccc-cccc-cccc-cccccccccccg', 'Proofreading', '33333333-3333-3333-3333-333333333336'),
('cccccccc-cccc-cccc-cccc-ccccccccccci', 'Resume Writing', '33333333-3333-3333-3333-333333333337'),

-- Marketing skills
('dddddddd-dddd-dddd-dddd-ddddddddddda', 'SEO', '44444444-4444-4444-4444-444444444445'),
('dddddddd-dddd-dddd-dddd-dddddddddddg', 'Keyword Research', '44444444-4444-4444-4444-444444444445'),
('dddddddd-dddd-dddd-dddd-dddddddddddh', 'Link Building', '44444444-4444-4444-4444-444444444445'),
('dddddddd-dddd-dddd-dddd-dddddddddddb', 'Social Media Management', '44444444-4444-4444-4444-444444444446'),
('dddddddd-dddd-dddd-dddd-dddddddddddj', 'Facebook Ads', '44444444-4444-4444-4444-444444444446'),
('dddddddd-dddd-dddd-dddd-dddddddddddl', 'Instagram Marketing', '44444444-4444-4444-4444-444444444446'),
('dddddddd-dddd-dddd-dddd-dddddddddddc', 'Email Marketing', '44444444-4444-4444-4444-444444444447'),
('dddddddd-dddd-dddd-dddd-dddddddddddm', 'MailChimp', '44444444-4444-4444-4444-444444444447'),
('dddddddd-dddd-dddd-dddd-dddddddddddp', 'Google Ads', '44444444-4444-4444-4444-444444444448');

-- Create sample users (in a real app, users would be created through auth.users)
-- For testing purposes, we'll insert directly into profiles
INSERT INTO profiles (id, username, full_name, email, avatar_url, bio, location, is_freelancer, is_client) VALUES
('00000000-0000-0000-0000-000000000001', 'alexmorgan', 'Alex Morgan', 'alex@example.com', '/placeholder.svg?height=300&width=300', 'Full Stack Developer with 8+ years of experience', 'San Francisco, CA', true, false),
('00000000-0000-0000-0000-000000000002', 'sarahjohnson', 'Sarah Johnson', 'sarah@example.com', '/placeholder.svg?height=300&width=300', 'Business owner looking for talented freelancers', 'New York, NY', false, true),
('00000000-0000-0000-0000-000000000003', 'michaelchen', 'Michael Chen', 'michael@example.com', '/placeholder.svg?height=300&width=300', 'Graphic designer specializing in branding and UI/UX', 'Los Angeles, CA', true, false),
('00000000-0000-0000-0000-000000000004', 'emilywilson', 'Emily Wilson', 'emily@example.com', '/placeholder.svg?height=300&width=300', 'Marketing agency owner seeking content creators', 'Chicago, IL', false, true),
('00000000-0000-0000-0000-000000000005', 'davidbrown', 'David Brown', 'david@example.com', '/placeholder.svg?height=300&width=300', 'Mobile app developer with focus on React Native', 'Seattle, WA', true, true);

-- Create freelancer profiles
INSERT INTO freelancer_profiles (id, title, hourly_rate, tagline, job_success_score, response_time, last_active, member_since) VALUES
('00000000-0000-0000-0000-000000000001', 'Full Stack Developer & UI/UX Designer', 65, 'Turning ideas into digital reality with clean code and beautiful design', 98, 'Within 1 hour', NOW(), '2020-01-15'),
('00000000-0000-0000-0000-000000000003', 'Graphic Designer & Illustrator', 55, 'Creating stunning visuals that capture your brand essence', 95, 'Within 2 hours', NOW(), '2019-06-22'),
('00000000-0000-0000-0000-000000000005', 'Mobile App Developer', 70, 'Building seamless mobile experiences for iOS and Android', 92, 'Within 3 hours', NOW(), '2021-03-10');

-- Create client profiles
INSERT INTO client_profiles (id, company_name, company_website, industry, payment_verified) VALUES
('00000000-0000-0000-0000-000000000002', 'Johnson Enterprises', 'www.johnsonenterprises.com', 'E-commerce', true),
('00000000-0000-0000-0000-000000000004', 'Wilson Marketing', 'www.wilsonmarketing.com', 'Marketing', true),
('00000000-0000-0000-0000-000000000005', 'Brown Tech Solutions', 'www.browntechsolutions.com', 'Technology', true);

-- Add skills to freelancers
INSERT INTO freelancer_skills (freelancer_id, skill_id, level) VALUES
-- Alex Morgan's skills
('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 95), -- React
('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac', 90), -- Node.js
('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 95), -- JavaScript
('00000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe', 80), -- UI/UX Design
('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad', 85), -- Python

-- Michael Chen's skills
('00000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba', 95), -- Photoshop
('00000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 90), -- Illustrator
('00000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 85), -- Figma
('00000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbf', 95), -- Logo Design
('00000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbg', 90), -- Digital Illustration

-- David Brown's skills
('00000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaai', 95), -- React Native
('00000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaj', 85), -- Flutter
('00000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 90), -- JavaScript
('00000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaag', 80), -- Swift
('00000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaah', 75); -- Kotlin

-- Add education for freelancers
INSERT INTO education (freelancer_id, institution, degree, field_of_study, start_date, end_date, description) VALUES
('00000000-0000-0000-0000-000000000001', 'Stanford University', 'Master of Computer Science', 'Human-Computer Interaction', '2015-09-01', '2017-06-30', 'Specialized in Human-Computer Interaction and Software Engineering'),
('00000000-0000-0000-0000-000000000001', 'University of California, Berkeley', 'Bachelor of Science', 'Computer Science', '2011-09-01', '2015-05-30', 'Minor in Design Innovation'),
('00000000-0000-0000-0000-000000000003', 'Rhode Island School of Design', 'Bachelor of Fine Arts', 'Graphic Design', '2012-09-01', '2016-05-30', 'Focus on digital media and brand identity'),
('00000000-0000-0000-0000-000000000005', 'Massachusetts Institute of Technology', 'Bachelor of Science', 'Computer Science', '2014-09-01', '2018-05-30', 'Specialized in mobile application development');

-- Add work experience for freelancers
INSERT INTO work_experience (freelancer_id, company, title, location, start_date, end_date, current, description) VALUES
('00000000-0000-0000-0000-000000000001', 'TechInnovate Solutions', 'Senior Full Stack Developer', 'San Francisco, CA', '2019-03-15', NULL, true, 'Lead developer for enterprise web applications, managing a team of 5 developers. Implemented microservices architecture that improved system performance by 40%.'),
('00000000-0000-0000-0000-000000000001', 'Creative Digital Agency', 'UI/UX Developer', 'San Francisco, CA', '2017-07-10', '2019-03-01', false, 'Designed and developed user interfaces for clients in finance, healthcare, and e-commerce sectors. Increased client conversion rates by an average of 25%.'),
('00000000-0000-0000-0000-000000000003', 'Design Masters Studio', 'Senior Graphic Designer', 'Los Angeles, CA', '2018-04-01', NULL, true, 'Lead designer for major brand identity projects, including logo design, marketing materials, and digital assets.'),
('00000000-0000-0000-0000-000000000003', 'Creative Minds Agency', 'Junior Designer', 'San Diego, CA', '2016-06-15', '2018-03-15', false, 'Created visual content for social media campaigns, websites, and print materials.'),
('00000000-0000-0000-0000-000000000005', 'Mobile Innovations', 'Lead Mobile Developer', 'Seattle, WA', '2020-01-15', NULL, true, 'Developing cross-platform mobile applications using React Native and Flutter. Implemented CI/CD pipelines that reduced deployment time by 60%.'),
('00000000-0000-0000-0000-000000000005', 'App Factory', 'Mobile Developer', 'Portland, OR', '2018-07-01', '2019-12-31', false, 'Developed iOS and Android applications for clients in various industries.');

-- Add certifications for freelancers
INSERT INTO certifications (freelancer_id, name, issuer, issue_date, expiration_date) VALUES
('00000000-0000-0000-0000-000000000001', 'AWS Certified Solutions Architect', 'Amazon Web Services', '2021-05-15', '2024-05-15'),
('00000000-0000-0000-0000-000000000001', 'Google Professional Cloud Developer', 'Google Cloud', '2020-11-10', '2023-11-10'),
('00000000-0000-0000-0000-000000000003', 'Adobe Certified Expert - Photoshop', 'Adobe', '2019-03-20', '2022-03-20'),
('00000000-0000-0000-0000-000000000003', 'Certified Graphic Designer', 'Graphic Artists Guild', '2020-07-15', NULL),
('00000000-0000-0000-0000-000000000005', 'React Native Certification', 'React Native Training', '2021-02-10', NULL),
('00000000-0000-0000-0000-000000000005', 'iOS App Development with Swift', 'Apple', '2020-09-05', NULL);

-- Create sample projects
INSERT INTO projects (id, client_id, title, description, budget_min, budget_max, budget_type, deadline, status) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'E-commerce Website Redesign', 'Looking for an experienced web developer to redesign our e-commerce website. The website should be responsive, user-friendly, and optimized for conversions. We need a modern design that reflects our brand identity and provides a seamless shopping experience.', 1500, 3000, 'fixed', NOW() + INTERVAL '14 days', 'open'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Content Creation for Marketing Campaign', 'We need a content writer to create engaging blog posts, social media content, and email newsletters for our upcoming marketing campaign. The content should be SEO-optimized and tailored to our target audience.', 500, 1000, 'fixed', NOW() + INTERVAL '7 days', 'open'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Mobile App Development for Retail Business', 'We are looking for a mobile app developer to create a shopping app for our retail business. The app should be available on both iOS and Android platforms and include features like product browsing, shopping cart, user accounts, and payment processing.', 3000, 5000, 'fixed', NOW() + INTERVAL '30 days', 'open'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Logo and Brand Identity Design', 'We need a graphic designer to create a new logo and brand identity for our company. The design should be modern, versatile, and reflect our company values. Deliverables include logo files in various formats, brand guidelines, and basic marketing materials.', 800, 1500, 'fixed', NOW() + INTERVAL '10 days', 'open'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'WordPress Website Development', 'Looking for a WordPress developer to create a professional website for our consulting business. The website should be responsive, SEO-friendly, and include features like contact forms, service pages, team profiles, and a blog section.', 1000, 2000, 'fixed', NOW() + INTERVAL '21 days', 'open');

-- Add project skills
INSERT INTO project_skills (project_id, skill_id) VALUES
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab'), -- React
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), -- JavaScript
('10000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe'), -- UI/UX Design
('10000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-ccccccccccca'), -- Content Writing
('10000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc'), -- Copywriting
('10000000-0000-0000-0000-000000000002', 'dddddddd-dddd-dddd-dddd-ddddddddddda'), -- SEO
('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaai'), -- React Native
('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaag'), -- Swift
('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaah'), -- Kotlin
('10000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba'), -- Photoshop
('10000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), -- Illustrator
('10000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbf'), -- Logo Design
('10000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf'), -- WordPress
('10000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae'), -- PHP
('10000000-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe'); -- UI/UX Design

-- Add project categories
INSERT INTO project_categories (project_id, category_id) VALUES
('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111112'), -- Web Development
('10000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333334'), -- Content Writing
('10000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111113'), -- Mobile Development
('10000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222223'), -- Logo Design
('10000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111112'); -- Web Development

-- Add bids
INSERT INTO bids (id, project_id, freelancer_id, amount, delivery_time, cover_letter, status) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 2500, 12, 'I have extensive experience with e-commerce website development using React and modern frontend technologies. I can create a responsive, user-friendly design that will help increase your conversion rates.', 'pending'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 4500, 25, 'As a mobile app developer specializing in React Native, I can create a cross-platform app that works seamlessly on both iOS and Android. I have experience with e-commerce apps and can implement all the required features.', 'pending'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 1200, 7, 'I specialize in logo design and brand identity creation. With my background in graphic design, I can create a modern and versatile logo that perfectly represents your company values.', 'accepted'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 1800, 15, 'I have built numerous WordPress websites for businesses across various industries. I can create a professional, responsive site with all the features you need, optimized for both users and search engines.', 'pending');

-- Create services
INSERT INTO services (id, freelancer_id, title, description, category_id, price, delivery_time, revisions) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Professional React Website Development', 'I will create a modern, responsive website using React and Next.js. The website will be fast, SEO-friendly, and designed with the latest UI/UX principles.', '11111111-1111-1111-1111-111111111112', 150, 7, 3),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Full Stack Web Application Development', 'I will build a complete web application with React frontend and Node.js backend. Includes database integration, user authentication, and API development.', '11111111-1111-1111-1111-111111111112', 350, 14, 2),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Professional Logo Design', 'I will design a modern, versatile logo for your business. Includes multiple concepts, revisions, and final files in various formats.', '22222222-2222-2222-2222-222222222223', 120, 5, 3),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Complete Brand Identity Package', 'I will create a comprehensive brand identity including logo, color palette, typography, business cards, and brand guidelines.', '22222222-2222-2222-2222-222222222226', 300, 10, 3),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Custom Mobile App Development', 'I will develop a custom mobile app for iOS and Android using React Native. Includes UI design, development, testing, and deployment assistance.', '11111111-1111-1111-1111-111111111113', 400, 21, 2);

-- Add service packages
INSERT INTO service_packages (service_id, name, description, price, delivery_time, revisions, features) VALUES
-- React Website Development packages
('30000000-0000-0000-0000-000000000001', 'basic', 'Basic package for simple websites', 150, 7, 2, ARRAY['5-page responsive website', 'Mobile-friendly design', 'Contact form', 'Basic SEO optimization']),
('30000000-0000-0000-0000-000000000001', 'standard', 'Standard package with additional features', 250, 10, 3, ARRAY['10-page responsive website', 'Mobile-friendly design', 'Contact form', 'Advanced SEO optimization', 'Social media integration', 'Google Analytics setup']),
('30000000-0000-0000-0000-000000000001', 'premium', 'Premium package with all features', 450, 14, 5, ARRAY['20-page responsive website', 'Mobile-friendly design', 'Contact form', 'Advanced SEO optimization', 'Social media integration', 'Google Analytics setup', 'E-commerce functionality', 'Custom animations', 'Performance optimization']),

-- Full Stack Web Application packages
('30000000-0000-0000-0000-000000000002', 'basic', 'Basic web application', 350, 14, 2, ARRAY['User authentication', 'Basic CRUD operations', 'Simple database integration', 'Responsive design']),
('30000000-0000-0000-0000-000000000002', 'standard', 'Standard web application with more features', 550, 21, 3, ARRAY['User authentication', 'Advanced CRUD operations', 'Complex database integration', 'Responsive design', 'File uploads', 'Admin dashboard', 'API documentation']),
('30000000-0000-0000-0000-000000000002', 'premium', 'Enterprise-level web application', 950, 30, 5, ARRAY['User authentication', 'Advanced CRUD operations', 'Complex database integration', 'Responsive design', 'File uploads', 'Admin dashboard', 'API documentation', 'Payment integration', 'Real-time features', 'Performance optimization', 'Comprehensive testing']),

-- Logo Design packages
('30000000-0000-0000-0000-000000000003', 'basic', 'Basic logo design', 120, 5, 2, ARRAY['2 logo concepts', '2 revisions', 'Final files in JPG, PNG, and PDF']),
('30000000-0000-0000-0000-000000000003', 'standard', 'Standard logo design with more options', 200, 7, 3, ARRAY['4 logo concepts', '3 revisions', 'Final files in all formats', 'Social media kit', 'Basic style guide']),
('30000000-0000-0000-0000-000000000003', 'premium', 'Premium logo design package', 300, 10, 5, ARRAY['6 logo concepts', 'Unlimited revisions', 'Final files in all formats', 'Social media kit', 'Comprehensive style guide', 'Business card design', 'Letterhead design']),

-- Brand Identity packages
('30000000-0000-0000-0000-000000000004', 'basic', 'Basic brand identity', 300, 10, 2, ARRAY['Logo design', 'Color palette', 'Typography selection', 'Basic brand guidelines']),
('30000000-0000-0000-0000-000000000004', 'standard', 'Standard brand identity package', 500, 14, 3, ARRAY['Logo design', 'Color palette', 'Typography selection', 'Comprehensive brand guidelines', 'Business card design', 'Letterhead design', 'Email signature']),
('30000000-0000-0000-0000-000000000004', 'premium', 'Premium brand identity package', 800, 21, 5, ARRAY['Logo design', 'Color palette', 'Typography selection', 'Comprehensive brand guidelines', 'Business card design', 'Letterhead design', 'Email signature', 'Social media templates', 'Brochure design', 'Packaging design concepts']),

-- Mobile App Development packages
('30000000-0000-0000-0000-000000000005', 'basic', 'Basic mobile app', 400, 21, 2, ARRAY['UI design', 'Core functionality', 'Cross-platform (iOS & Android)', 'Basic user authentication']),
('30000000-0000-0000-0000-000000000005', 'standard', 'Standard mobile app with more features', 700, 30, 3, ARRAY['UI/UX design', 'Advanced functionality', 'Cross-platform (iOS & Android)', 'User authentication', 'Push notifications', 'Offline mode', 'Analytics integration']),
('30000000-0000-0000-0000-000000000005', 'premium', 'Premium mobile app with all features', 1200, 45, 5, ARRAY['UI/UX design', 'Advanced functionality', 'Cross-platform (iOS & Android)', 'User authentication', 'Push notifications', 'Offline mode', 'Analytics integration', 'Payment processing', 'Social media integration', 'Admin dashboard', 'App store submission assistance']);

-- Add service images
INSERT INTO service_images (service_id, image_url, is_primary) VALUES
('30000000-0000-0000-0000-000000000001', '/placeholder.svg?height=600&width=800&text=React Website', true),
('30000000-0000-0000-0000-000000000001', '/placeholder.svg?height=600&width=800&text=React Website 2', false),
('30000000-0000-0000-0000-000000000001', '/placeholder.svg?height=600&width=800&text=React Website 3', false),
('30000000-0000-0000-0000-000000000002', '/placeholder.svg?height=600&width=800&text=Full Stack App', true),
('30000000-0000-0000-0000-000000000002', '/placeholder.svg?height=600&width=800&text=Full Stack App 2', false),
('30000000-0000-0000-0000-000000000003', '/placeholder.svg?height=600&width=800&text=Logo Design', true),
('30000000-0000-0000-0000-000000000003', '/placeholder.svg?height=600&width=800&text=Logo Design 2', false),
('30000000-0000-0000-0000-000000000003', '/placeholder.svg?height=600&width=800&text=Logo Design 3', false),
('30000000-0000-0000-0000-000000000004', '/placeholder.svg?height=600&width=800&text=Brand Identity', true),
('30000000-0000-0000-0000-000000000004', '/placeholder.svg?height=600&width=800&text=Brand Identity 2', false),
('30000000-0000-0000-0000-000000000005', '/placeholder.svg?height=600&width=800&text=Mobile App', true),
('30000000-0000-0000-0000-000000000005', '/placeholder.svg?height=600&width=800&text=Mobile App 2', false);

-- Add service skills
INSERT INTO service_skills (service_id, skill_id) VALUES
('30000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab'), -- React
('30000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), -- JavaScript
('30000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe'), -- UI/UX Design
('30000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab'), -- React
('30000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac'), -- Node.js
('30000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), -- JavaScript
('30000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba'), -- Photoshop
('30000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), -- Illustrator
('30000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbf'), -- Logo Design
('30000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbba'), -- Photoshop
('30000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), -- Illustrator
('30000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbf'), -- Logo Design
('30000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaai'), -- React Native
('30000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), -- JavaScript
('30000000-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbe'); -- UI/UX Design

-- Create sample orders
INSERT INTO orders (id, client_id, freelancer_id, service_id, package_id, title, description, amount, status, delivery_date) VALUES
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', (SELECT id FROM service_packages WHERE service_id = '30000000-0000-0000-0000-000000000003' AND name = 'standard'), 'Logo Design for Johnson Enterprises', 'Create a modern logo for our e-commerce business', 200, 'completed', NOW() - INTERVAL '15 days'),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', (SELECT id FROM service_packages WHERE service_id = '30000000-0000-0000-0000-000000000001' AND name = 'premium'), 'Website Development for Wilson Marketing', 'Develop a modern website for our marketing agency', 450, 'completed', NOW() - INTERVAL '30 days'),
('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', (SELECT id FROM service_packages WHERE service_id = '30000000-0000-0000-0000-000000000005' AND name = 'standard'), 'Mobile App for Johnson Enterprises', 'Develop a mobile app for our e-commerce platform', 700, 'in_progress', NOW() + INTERVAL '10 days');

-- Add reviews
INSERT INTO reviews (id, order_id, reviewer_id, reviewee_id, rating, comment) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 5, 'Michael did an amazing job with our logo design. He was very responsive and delivered the project ahead of schedule. The logo perfectly captures our brand identity. Highly recommended!'),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 5, 'Great client to work with! Clear requirements and prompt feedback throughout the project.'),
('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 4, 'Alex created a beautiful website for our agency. The design is modern and the functionality works great. The only reason for 4 stars instead of 5 is that we had to request some minor revisions after the initial delivery.'),
('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 5, 'Emily was a pleasure to work with. Clear communication and prompt payment.');

-- Add review metrics
INSERT INTO review_metrics (review_id, communication, quality, expertise, professionalism, hire_again) VALUES
('50000000-0000-0000-0000-000000000001', 5, 5, 5, 5, true),
('50000000-0000-0000-0000-000000000002', 5, 5, 4, 5, true),
('50000000-0000-0000-0000-000000000003', 4, 4, 5, 5, true),
('50000000-0000-0000-0000-000000000004', 5, 5, 5, 5, true);

-- Create conversations
INSERT INTO conversations (id, project_id, order_id) VALUES
('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', NULL),
('60000000-0000-0000-0000-000000000002', NULL, '40000000-0000-0000-0000-000000000001'),
('60000000-0000-0000-0000-000000000003', NULL, '40000000-0000-0000-0000-000000000002');

-- Add conversation participants
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004');

-- Add messages
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hi Alex, I''m interested in your bid for my e-commerce website project. Can you tell me more about your experience with similar projects?', true, NOW() - INTERVAL '3 days'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Hello Sarah, thanks for reaching out! I''ve developed several e-commerce websites using React and modern frontend technologies. My most recent project was for a fashion retailer where I implemented features like product filtering, shopping cart, and payment processing. I''d be happy to share more details or answer any specific questions you have.', true, NOW() - INTERVAL '3 days'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'That sounds great! Do you have experience with any specific e-commerce platforms or payment gateways?', true, NOW() - INTERVAL '2 days'),
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Yes, I have experience with WooCommerce, Shopify, and custom solutions. For payment gateways, I''ve integrated Stripe, PayPal, and Square. I can recommend the best option based on your specific needs and budget.', true, NOW() - INTERVAL '2 days'),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Hi Michael, I wanted to check in on the logo design project. How is it coming along?', true, NOW() - INTERVAL '20 days'),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Hello Sarah, I''ve completed the initial concepts and will be sending them over for your review later today. I''ve created 4 different options based on our discussions. Looking forward to your feedback!', true, NOW() - INTERVAL '20 days'),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Hi Alex, I just wanted to say that we''re very happy with the website you created for us. It looks great and works perfectly!', true, NOW() - INTERVAL '25 days'),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Thank you, Emily! I''m glad you''re happy with the result. If you need any updates or have questions about managing the content, feel free to reach out anytime.', true, NOW() - INTERVAL '25 days');

-- Add photographers
INSERT INTO photographers (id, specialties, equipment, location_lat, location_lng, location_address, availability_schedule, booking_notice) VALUES
('00000000-0000-0000-0000-000000000003', ARRAY['Portrait', 'Commercial', 'Product'], ARRAY['Canon EOS R5', 'Various prime lenses', 'Professional lighting equipment'], 34.0522, -118.2437, 'Los Angeles, CA', 'Available weekdays and select weekends', 'Please book at least 3 days in advance');

-- Add photographer portfolio
INSERT INTO photographer_portfolio (photographer_id, title, description, category, image_url) VALUES
('00000000-0000-0000-0000-000000000003', 'Product Photography', 'Professional product photography for e-commerce', 'Commercial', '/placeholder.svg?height=400&width=600&text=Product Photo 1'),
('00000000-0000-0000-0000-000000000003', 'Corporate Portraits', 'Professional headshots for executives', 'Portrait', '/placeholder.svg?height=400&width=600&text=Portrait 1'),
('00000000-0000-0000-0000-000000000003', 'Brand Campaign', 'Commercial photography for brand marketing', 'Commercial', '/placeholder.svg?height=400&width=600&text=Commercial 1');

-- Add notifications
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
('00000000-0000-0000-0000-000000000001', 'bid_response', 'Bid Response', 'Sarah Johnson has sent you a message about your bid on "E-commerce Website Redesign"', false),
('00000000-0000-0000-0000-000000000002', 'new_bid', 'New Bid Received', 'You have received a new bid on your project "E-commerce Website Redesign"', true),
('00000000-0000-0000-0000-000000000003', 'order_completed', 'Order Completed', 'Your order "Logo Design for Johnson Enterprises" has been completed', true),
('00000000-0000-0000-0000-000000000004', 'review_received', 'New Review', 'Alex Morgan has left a review for your order "Website Development for Wilson Marketing"', false);

-- Add saved items
INSERT INTO saved_freelancers (user_id, freelancer_id) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001');

INSERT INTO saved_projects (freelancer_id, project_id) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005'),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004');

INSERT INTO saved_services (user_id, service_id) VALUES
('00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001');
