# SoftGang Search

A lab project demonstrating an AI-powered candidate search and recruiter assistance platform built with **LangGraph** and **Supabase**. This application enables recruiters to search for candidates, analyze resumes, send emails, and book interviews directly within an intelligent chat interface.

## 🎯 Overview

SoftGang Search is an experimental recruitment assistant that combines semantic search, AI-powered conversation, and integrated productivity tools to streamline the candidate sourcing and engagement process. The platform uses LangGraph to create intelligent agents that can understand natural language queries, search through candidate databases, and perform actions like scheduling interviews.

## ✨ Features

### 🔍 Candidate Search
- **Semantic Search**: Leverages vector embeddings (Pinecone) for intelligent candidate matching
- **Advanced Filtering**: Search by skills, experience level, location, education, and more
- **Resume Analysis**: AI-powered analysis of candidate qualifications and experience
- **Multi-criteria Matching**: Combine multiple search parameters for precise candidate discovery

### 💬 AI-Powered Chat Interface
- **Natural Language Queries**: Interact with the assistant using conversational language
- **Context-Aware Conversations**: Maintains conversation history and context across sessions
- **Thread Management**: Organize conversations into threads with automatic summarization
- **Resume Q&A**: Ask detailed questions about candidate qualifications and experience

### 📅 Interview Scheduling
- **Google Calendar Integration**: View and create calendar events directly from the chat
- **Automated Scheduling**: Book interviews with candidates seamlessly
- **Calendar Management**: Check availability and manage appointments

### 📧 Email Integration
- **Direct Email Sending**: Send emails to candidates directly within the chat interface
- **Streamlined Communication**: Eliminate context switching between tools

### 🔐 Authentication & Security
- **Supabase Auth**: Secure authentication with Google OAuth
- **User Sessions**: Persistent sessions with thread management
- **Data Isolation**: User-specific data access and privacy

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - UI library

### AI & ML
- **LangGraph** - Agent orchestration and state management
- **LangChain** - LLM framework and tool integration
- **OpenAI GPT-4.1** - Language model for conversational AI
- **OpenAI Embeddings** - Vector embeddings for semantic search
- **Pinecone** - Vector database for candidate search

### Database & Backend
- **PostgreSQL** - Primary database (via Prisma)
- **Prisma** - ORM and database management
- **Supabase** - Authentication and backend services
- **LangGraph Checkpoint Postgres** - State persistence for agents

### Integrations
- **Google Calendar API** - Calendar management and scheduling
- **Google OAuth** - Authentication and calendar access

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Lucide React** - Icon library

## 📁 Project Structure

```
softgang-search/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   ├── api/                # API routes
│   │   │   ├── chat/           # Chat API endpoint
│   │   │   └── search/         # Search API endpoint
│   │   ├── chat/               # Chat interface
│   │   └── auth/               # Auth callbacks
│   ├── lib/
│   │   ├── agents/             # LangGraph agents
│   │   │   ├── tools/          # Agent tools
│   │   │   │   ├── google/     # Google Calendar tools
│   │   │   │   └── ...         # Other tools
│   │   │   ├── index.ts        # Agent creation
│   │   │   └── state.ts        # Agent state management
│   │   ├── supabase/           # Supabase client utilities
│   │   ├── services/           # External service integrations
│   │   ├── vector-store.ts     # Pinecone vector store
│   │   └── prisma.ts           # Prisma client
│   ├── components/             # React components
│   ├── schemas/                # Zod schemas
│   └── scripts/                # Utility scripts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun**
- **PostgreSQL** database
- **Supabase** account and project
- **OpenAI** API key
- **Pinecone** account and API key
- **Google Cloud** project with Calendar API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd softgang-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/softgang_search"
   DIRECT_URL="postgresql://user:password@localhost:5432/softgang_search"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # Pinecone
   PINECONE_API_KEY="your-pinecone-api-key"
   PINECONE_INDEX="your-index-name"
   
   # Google OAuth (for Calendar integration)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Build the vector store** (if you have candidate data)
   ```bash
   npm run build:vector-store
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run build:vector-store` - Build vector embeddings for candidates

## 🏗️ Architecture

### Agent System

The application uses LangGraph's `createReactAgent` to build an intelligent assistant that can:

1. **Search Candidates**: Uses semantic search with Pinecone to find matching candidates
2. **Analyze Resumes**: Extracts and analyzes candidate information from resumes
3. **Manage Calendar**: Integrates with Google Calendar to view and create events
4. **Maintain Context**: Uses PostgreSQL checkpoints to persist conversation state

### State Management

- **Thread-based Conversations**: Each conversation is stored as a thread with persistent state
- **Checkpoint System**: LangGraph checkpoints save agent state to PostgreSQL
- **Message History**: Full conversation history maintained per thread

### Vector Search

- **Embeddings**: Candidate resumes are embedded using OpenAI's `text-embedding-3-small`
- **Metadata Filtering**: Supports filtering by experience, skills, location, etc.
- **Similarity Search**: Returns top-k candidates based on semantic similarity

## 🔧 Configuration

### Supabase Setup

1. Create a Supabase project
2. Enable Google OAuth provider
3. Configure OAuth redirect URLs
4. Set up database tables (handled by Prisma migrations)

### Google Calendar Integration

1. Create a Google Cloud project
2. Enable Google Calendar API
3. Set up OAuth 2.0 credentials
4. Configure redirect URIs
5. Add credentials to environment variables

### Pinecone Setup

1. Create a Pinecone account
2. Create an index with appropriate dimensions (1536 for `text-embedding-3-small`)
3. Add API key and index name to environment variables

## 📊 Database Schema

Key models:
- **Candidate**: Stores candidate information, skills, experience
- **Industry**: Industry categorization
- **Thread**: Conversation threads with state
- **UserOAuthIntegration**: OAuth token storage
- **Checkpoint tables**: LangGraph state persistence

## 🤝 Contributing

This is a lab project for experimentation and learning. Contributions, suggestions, and feedback are welcome!

## 📄 License

This project is for educational and experimental purposes.

## 🙏 Acknowledgments

- Built with [LangGraph](https://github.com/langchain-ai/langgraph)
- Powered by [Supabase](https://supabase.com)
- UI components from [DaisyUI](https://daisyui.com)

---

**Note**: This is a lab project and should be used for experimentation and learning purposes. Not recommended for production use without proper security audits and testing.
