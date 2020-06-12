from django.db import models

# Create your models here.


class Table(models.Model):
   
    
    blind_choices = (('1-2', '1-2'),('2-4','2-4'), ('5-10', '5-10'))
    no_of_players = (('2', 'Heads Up'),('6',  '6 Max'), ('9', '9 Max'))
    game_types = (('NL', 'No Limit Holdem'), ('PLO', 'Pot Limit Omaha'))
    
    
    name = models.CharField(max_length = 50)
    blinds = models.CharField(max_length = 10,  choices = blind_choices )
    max_players = models.CharField(max_length = 1, choices = no_of_players)
    game_type = models.CharField(max_length = 3, choices = game_types)
    
    def __str__(self):
        
        return self.name
    class Meta:
        ordering = ['game_type', 'blinds', 'max_players']