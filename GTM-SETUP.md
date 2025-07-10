# Google Tag Manager Setup Guide

## Overview
The codebase now includes comprehensive conversion tracking through Google Tag Manager (GTM). This guide explains how to configure GTM to track these events.

## Container ID
Your GTM Container ID: `GTM-52GWBKBZ`

## Events Being Tracked

### 1. ChatGPT Button Clicks
- **Event Name**: `conversion`
- **Data Layer Variables**:
  - `conversion_type`: `chatgpt_click`
  - `prompt_id`: The unique ID of the prompt
  - `prompt_title`: The title of the prompt
  - `category`: `engagement`
  - `action`: `click`
  - `label`: `chatgpt_integration`

### 2. Copy Prompt
- **Event Name**: `conversion`
- **Data Layer Variables**:
  - `conversion_type`: `copy_prompt`
  - `prompt_id`: The unique ID of the prompt
  - `prompt_title`: The title of the prompt
  - `category`: `engagement`
  - `action`: `copy`
  - `label`: `prompt_text`

### 3. Prompt Views
- **Event Name**: `conversion`
- **Data Layer Variables**:
  - `conversion_type`: `view_prompt`
  - `prompt_id`: The unique ID of the prompt
  - `prompt_title`: The title of the prompt
  - `category`: The prompt's category (e.g., "Portrait", "Creative")
  - `action`: `view`
  - `label`: `prompt_detail`

### 4. Search
- **Event Name**: `conversion`
- **Data Layer Variables**:
  - `conversion_type`: `search`
  - `search_query`: The search term used
  - `category`: `search`
  - `action`: `search`
  - `label`: The search query
  - `value`: Number of results found

### 5. Category Browse
- **Event Name**: `conversion`
- **Data Layer Variables**:
  - `conversion_type`: `category_browse`
  - `category`: The category name
  - `action`: `browse`
  - `label`: `category_{categoryName}`

### 6. Tag Browse
- **Event Name**: `conversion`
- **Data Layer Variables**:
  - `conversion_type`: `tag_browse`
  - `category`: `navigation`
  - `action`: `browse`
  - `label`: `tag_{tagName}`

## GTM Configuration Steps

### 1. Create Data Layer Variables
In GTM, create the following Data Layer Variables:
- `dlv.conversion_type`
- `dlv.prompt_id`
- `dlv.prompt_title`
- `dlv.category`
- `dlv.action`
- `dlv.label`
- `dlv.value`
- `dlv.search_query`

### 2. Create Triggers
Create a Custom Event trigger for:
- **Trigger Name**: Conversion Events
- **Event Name**: `conversion`

### 3. Create GA4 Configuration Tag
If not already set up:
- **Tag Type**: Google Analytics: GA4 Configuration
- **Measurement ID**: Your GA4 Measurement ID
- **Trigger**: All Pages

### 4. Create Conversion Tags
For each conversion type, create a GA4 Event tag:

#### Example: ChatGPT Click Conversion
- **Tag Type**: Google Analytics: GA4 Event
- **Configuration Tag**: Select your GA4 Configuration tag
- **Event Name**: `chatgpt_click`
- **Event Parameters**:
  - `prompt_id`: {{dlv.prompt_id}}
  - `prompt_title`: {{dlv.prompt_title}}
- **Trigger**: Conversion Events (with additional condition: `dlv.conversion_type` equals `chatgpt_click`)

Repeat similar setup for other conversion types.

### 5. Enhanced E-commerce Tracking (Optional)
You can also track these as enhanced e-commerce events:
- Prompt views as `view_item`
- ChatGPT clicks as `begin_checkout`
- Category/tag browse as `view_item_list`

## Testing

1. Use GTM Preview mode to test events
2. Check that data layer pushes are working correctly
3. Verify events are appearing in GA4 DebugView
4. Test all conversion types:
   - View a prompt detail page
   - Click "Open in ChatGPT"
   - Click "Copy Prompt"
   - Perform a search
   - Click on categories and tags

## Data Attributes
The following data attributes are also added to elements for GTM's Auto-Event tracking:
- `data-gtm-event`: Event type
- `data-gtm-prompt-id`: Prompt ID
- `data-gtm-prompt-title`: Prompt title

These can be used with GTM's Click triggers if you prefer not to use dataLayer events.