from flask import Flask, render_template, request, jsonify

import os

from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Mapping levels to commit counts to handle multiple colors in the commit graph
COMMIT_MAP = {1:1,2:2,3:5}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/draw', methods=['POST'])
def draw():
    # Grab the list of dates that arrives as a list of strings and a number of times to commit
    data = request.json
    
    # Total commits
    total_commits = 0
    
    for date_str, level in data.items():
        # Check how many commits for this level
        count = COMMIT_MAP.get(level,0)
        
        for _ in range(count):
            with open("art_log.txt", "a") as f:
                f.write(f"Level {level} pixel on {date_str}\n")
            
            os.system("git add art_log.txt")
            
            # Tricking git into recording the commit on the date I selected, rather than today
            os.system(f'GIT_AUTHOR_DATE="{date_str}T12:00:00" GIT_COMMITTER_DATE="{date_str}T12:00:00" git commit -m "GitHub Art Level {level}"')
            
            total_commits += 1
            
        # Send a success message to the browser
        return jsonify({"status": "success", "message": f"Created {total_commits} commits across {len(data)} days!"})
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)