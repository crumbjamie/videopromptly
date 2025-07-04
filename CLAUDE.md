# Claude Code Project Instructions

## Thumbnail Management Process

When adding new thumbnails to prompts:

1. **Check for new thumbnails**: Look in `/public/thumbnails` directory
2. **Rename files**: Replace spaces with hyphens (-) in filenames
3. **Find unmatched prompts**: Identify prompts without thumbnail images
4. **Match thumbnails**: Match renamed thumbnails to prompts based on title/slug similarity
5. **Create square versions**: Generate square cropped versions for card view
   - Full images: Used in detail view
   - Square thumbnails: Used in card/grid view
6. **Confirm before applying**: Always show the list of matches for approval
7. **Update database**: Update prompts.json with thumbnail references

### Available Scripts for Thumbnail Management

1. **Process all thumbnails (complete workflow)**: `npm run process:thumbnails`
   - Runs the complete thumbnail processing workflow in order:
     - Renames files with spaces to use hyphens
     - Generates square thumbnails
     - Matches thumbnails to prompts in database
   - This is the main command to use when adding new images

2. **Update thumbnails in database**: `node scripts/update-thumbnails.js`
   - Maps thumbnail files to prompts based on slug names
   - Updates prompts.json with thumbnail references
   - Adds thumbnails as `{ before: 'woman-sample.jpg', after: thumbnailFile }`

3. **Generate square thumbnails**: `npx tsx scripts/generate-square-thumbnails.ts`
   - Creates 1024x1024 square versions from existing thumbnails
   - Saves to `/public/thumbnails/square/` directory
   - Converts to WebP format with 85% quality
   - Automatically crops landscape/portrait images to center

4. **Find unmatched thumbnails**: `node scripts/find-unmatched-thumbnails.js`
   - Lists thumbnail files that don't have matching prompts
   - Helps identify orphaned files

5. **Generate new thumbnails with AI**: `npx tsx scripts/generate-thumbnails.ts`
   - Uses DALL-E 3 API to generate thumbnails
   - Creates before/after composite images
   - Requires API keys and sample images

### Workflow for Adding New Thumbnails

1. Place new thumbnail images in `/public/thumbnails/`
2. Run `npm run process:thumbnails` - This single command will:
   - Rename files with spaces to use hyphens
   - Generate square thumbnails
   - Update the database with thumbnail references
3. Check for any unmatched files with `node scripts/find-unmatched-thumbnails.js`

## Running Linting and Type Checking

When code changes are made:
- Run: `npm run lint`
- Run: `npm run typecheck`

## ChatGPT Integration Text

The prefix text for ChatGPT integration is:
"Create an image using the prompt below. Tweak the prompt if needed and then I will upload the subject image."