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

## Implementation Roadmap

### Phase 1
- Project Architecture
- Warehouse Setup
- Data Modeling
- Chat Interface Foundation

### Phase 2
- Semantic Layer Development
- AI Agent Integration
- API Development

### Phase 3
- Dynamic Visualizations
- Multi-step Reasoning
- Business Metrics

### Phase 4
- Testing
- Optimization
- Final Deployment

## Core Features

- Enterprise Business Analytics
- Natural Language Querying
- Semantic Metric Definitions
- AI-powered Business Insights
- Governed Data Access
- Interactive Chat Interface
- Dynamic Data Visualizations

## Current Progress

- Project repository initialized
- Enterprise project architecture established
- Development environment configured
- Technology stack finalized
- Phase 1 implementation started

## Upcoming Modules

- Snowflake Warehouse
- dbt Models
- Cube.dev Semantic Layer
- LangChain AI Agent
- Next.js Chat UI
- REST API
- Interactive Dashboard

## Future Enhancements

- Authentication
- Role-based Access
- Dashboard Export
- KPI Monitoring
- Query History
- AI Suggestions