# MCD (Modèle Conceptuel de Données)

![MCD-Crenevo](MCD-Crenevo.png)

# MLD (Modèle Logique de Données)

USER (id, last_name, first_name, email, password_hash, role, active)<br>
ROOM (id, name, building, floor, capacity, description, approval_required, active)<br>
RESERVATION (id, subject, description, start_at, end_at, participant_count, status, rejection_reason, processed_at, canceled_at, #user_id, #room_id, #manager_id)<br>
EQUIPMENT (id, name, description, active)<br>
ROOM_EQUIPMENT (#room_id, #equipment_id, quantity)<br>
UNAVAILABILITY (id, start_at, end_at, reason, #room_id, #manager_id)<br>
INCIDENT (id, title, description, status, reported_at, resolved_at, #room_id, #reported_by_id, #manager_id)<br>

# MPD (Modèle Physique de Données)

```sql


CREATE TABLE "user" (                              
    id SERIAL PRIMARY KEY,                         
    last_name TEXT NOT NULL,                       
    first_name TEXT NOT NULL,                      
    email TEXT UNIQUE NOT NULL,                    
    password_hash TEXT NOT NULL, 
    active BOOLEAN NOT NULL DEFAULT TRUE,                  
    role TEXT NOT NULL DEFAULT 'user'              
         CHECK (role IN ('user', 'manager')),
               
);


CREATE TABLE room (                                
    id SERIAL PRIMARY KEY,                         
    name TEXT NOT NULL,                            
    building TEXT NOT NULL,                        
    floor TEXT,                                    
    capacity INT NOT NULL,                         
    description TEXT,                              
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE           
);


CREATE TABLE equipment (                           
    id SERIAL PRIMARY KEY,                         
    name TEXT UNIQUE NOT NULL,                     
    description TEXT,                              
    active BOOLEAN NOT NULL DEFAULT TRUE           
);


CREATE TABLE room_equipment (  
    id SERIAL PRIMARY KEY,                   
    room_id INT NOT NULL REFERENCES room(id)      
            ON DELETE CASCADE,
    equipment_id INT NOT NULL REFERENCES equipment(id)
                 ON DELETE CASCADE,                
    quantity INT NOT NULL DEFAULT 1                
             CHECK (quantity > 0),
    PRIMARY KEY (room_id, equipment_id)
);


CREATE TABLE reservation (                         
    id SERIAL PRIMARY KEY,                        
    subject TEXT NOT NULL,                         
    description TEXT,                              
    start_at TIMESTAMP NOT NULL,                   
    end_at TIMESTAMP NOT NULL,                     
    participant_count INT NOT NULL,                
    status TEXT NOT NULL DEFAULT 'pending',        
    rejection_reason TEXT,                         
    processed_at TIMESTAMP,                        
    canceled_at TIMESTAMP,                         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL REFERENCES "user"(id)     
            ON DELETE RESTRICT,
    room_id INT NOT NULL REFERENCES room(id)       
            ON DELETE RESTRICT,
    manager_id INT REFERENCES "user"(id)           
               ON DELETE RESTRICT
);


CREATE TABLE unavailability (                      
    id SERIAL PRIMARY KEY,                        
    start_at TIMESTAMP NOT NULL,                   
    end_at TIMESTAMP NOT NULL,                     
    reason TEXT NOT NULL,                          
    room_id INT NOT NULL REFERENCES room(id)       
            ON DELETE RESTRICT,
    manager_id INT NOT NULL REFERENCES "user"(id)  
               ON DELETE RESTRICT
);


CREATE TABLE incident (                            
    id SERIAL PRIMARY KEY,                         
    title TEXT NOT NULL,                           
    description TEXT NOT NULL,                     
    status TEXT NOT NULL DEFAULT 'open',           
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,                         
    room_id INT NOT NULL REFERENCES room(id)       
            ON DELETE RESTRICT,
    reported_by_id INT NOT NULL REFERENCES "user"(id)
                   ON DELETE RESTRICT,             
    manager_id INT NOT NULL REFERENCES "user"(id)  
               ON DELETE RESTRICT
);

```
