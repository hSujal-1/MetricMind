# MetricMind

## Enterprise Semantic BI Engine using AI, Semantic Layer and Modern Data Analytics

Project 1 for the Axlero AI Engineering Internship.

### Description

MetricMind is an enterprise analytics platform that allows business users to ask questions in natural language while ensuring consistent business metrics through a governed semantic layer.

This project enables users to query enterprise business metrics using natural language by combining Snowflake, dbt, Cube.dev, LangChain, and Next.js.

### Technologies

- Python
- SQL
- Git
- GitHub
- Snowflake
- dbt
- Cube.dev
- LangChain
- Next.js

## Project Architecture

```text
                        User
                          │
                          ▼
                Frontend (Next.js)
                          │
                          ▼
           Backend API (Python + LangChain)
                          │
                          ▼
           Semantic Layer (Cube.dev)
                          │
                          ▼
               dbt Transformation Models
                          │
                          ▼
            Snowflake Data Warehouse
                          ▲
                          │
              Raw Business Data (CSV)
```
## Project Structure

```text
MetricMind/
│
├── backend/               # Backend APIs and business logic
├── frontend/              # Next.js chat interface
├── dashboard/             # Analytics dashboards
├── data/
│   ├── raw/               # Raw business datasets
│   └── transformed/       # Cleaned and transformed datasets
│
├── dbt/                   # dbt transformation models
├── semantic/              # Cube.dev semantic layer
├── docs/                  # Project documentation
├── images/                # Images and diagrams
├── sql/                   # SQL scripts
├── src/                   # Source code
├── tests/                 # Unit and integration tests
│
├── README.md
├── requirements.txt
└── .gitignore
```
## Technology Stack

| Layer | Technology |
|--------|------------|
| Programming Language | Python |
| Database | Snowflake |
| Data Transformation | dbt |
| Semantic Layer | Cube.dev |
| AI Framework | LangChain |
| Frontend | Next.js |
| Version Control | Git |
| Repository | GitHub |


## Core Features

- AI-powered Natural Language Query Interface
- Enterprise Semantic Metrics Layer
- Modern ELT Pipeline using dbt
- Snowflake Cloud Data Warehouse
- Interactive Business Intelligence Dashboard
- Governed Business Metrics
- AI-driven Business Insights
- Scalable Data Modeling Architecture
- Streaming Chat-based Analytics
- Enterprise-grade Project Structure

## Planned Enhancements

- Role-based Authentication
- Query History
- KPI Monitoring Dashboard
- Predictive Analytics
- Multi-agent AI Workflow
- Report Export (PDF/Excel)
- Interactive Data Visualizations
- Real-time Business Metrics
- Dashboard Sharing
- Performance Optimization