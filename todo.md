# USV Articulation Portal TODO

## Database Schema & Backend
- [x] Design and implement database schema for courses, institutions, degree programs, articulation mappings
- [x] Create tRPC procedures for course CRUD operations
- [x] Create tRPC procedures for articulation mapping management
- [x] Create tRPC procedures for degree program requirements
- [x] Implement LLM-powered course analysis for similarity scoring
- [ ] Implement PDF parsing for catalog extraction (basic structure in place)
- [x] Create database query helpers for complex articulation queries

## Admin Dashboard
- [x] Admin dashboard layout with navigation
- [x] Course catalog management interface (USV courses)
- [x] Community college course management interface
- [x] Articulation mapping creation and editing interface
- [x] Approval workflow for articulation mappings
- [ ] Degree program requirements management (backend ready, UI pending)
- [x] Statistics and analytics dashboard
- [x] CSV import/export functionality (UI complete, backend needs implementation)
- [ ] PDF upload and parsing interface (planned feature)
- [ ] Batch operations for articulation mappings (planned feature)

## Student-Facing Features
- [x] Transfer credit estimator tool
- [x] Degree program selector
- [x] Community college selector
- [x] Interactive transfer pathway visualization
- [x] General Education transfer guide (integrated into estimator)
- [x] Course equivalency search
- [x] Transfer credit calculator by degree program

## Data Population
- [x] Extract course data from USV catalog PDF
- [x] Extract course data from community college catalogs
- [x] Populate USV degree program requirements
- [x] Create initial articulation mappings
- [x] Populate GE area mappings

## Testing & Refinement
- [x] Test all CRUD operations
- [x] Test LLM course analysis
- [ ] Test PDF parsing (not yet implemented)
- [ ] Test CSV import/export (UI only, backend pending)
- [x] Test transfer credit calculator accuracy
- [x] Test all user workflows


## Bug Fixes
- [x] Fix transfer pathway query - no courses showing for selection in transfer estimator
- [x] Populate degree requirements table with actual course requirements
- [x] Update pathway query to properly join requirements with articulation mappings


## Course Catalog Expansion
- [x] Research Foothill College course catalog for all relevant departments
- [x] Research De Anza College course catalog for all relevant departments
- [x] Research San José City College course catalog for all relevant departments
- [x] Research Evergreen Valley College course catalog for all relevant departments
- [x] Research Sierra College course catalog for all relevant departments
- [x] Add comprehensive business courses from all CCs (88 courses)
- [x] Add comprehensive computer science/software development courses from all CCs (71 courses)
- [x] Add comprehensive game design/development courses from all CCs (included in CS)
- [x] Add comprehensive digital art/animation courses from all CCs (39 courses)
- [x] Add comprehensive digital audio technology courses from all CCs (23 courses)
- [x] Add comprehensive general education courses from all CCs (70 courses)
- [x] Create articulation mappings for new courses (56 mappings created)
- [x] Verify all new course data is properly seeded (263 courses added)


## Navigation & Routing Issues
- [x] Fix 404 errors on Browse Course Mappings page
- [x] Fix 404 errors on Admin Dashboard page
- [x] Verify all navigation links work correctly
- [x] Test routing for all pages

## Bug Fixes - Nested Anchor Tags
- [x] Fix nested anchor tag error in Articulations page header
- [x] Fix nested anchor tags in Home page navigation and CTAs
- [x] Add explicit <a> tags inside Link components to prevent nesting
