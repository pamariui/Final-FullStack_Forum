CREATE TABLE question_tags (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	question_id INT NOT NULL,
	tag_id INT NOT NULL,
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
	FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);