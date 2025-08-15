# MedVerify Frontend (Next.js)

A modern, responsive frontend for creating and verifying medical prescriptions with optional Solana wallet signing.

Features
- Authentication (register/login) with JWT from backend
- Role-based access: doctor, pharmacist, patient, admin
- Dashboard + Sidebar layout
- Prescriptions list and detail view
- Create prescription (doctor)
- Verify prescription (pharmacist)
- Wallet integration (Phantom/Solflare) for signing actions (message signing)

Environment
- NEXT_PUBLIC_API_BASE_URL: Base URL of the backend (e.g., http://localhost:8000)

Run
- npm install
- npm run dev

Notes
- Wallet signing uses window.solana (Phantom) or window.solflare if available. For full transaction submission you may extend this with @solana/web3.js and wallet-adapter packages once versions matching React 19 are confirmed.
